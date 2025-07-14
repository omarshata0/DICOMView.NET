import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import * as cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";
import { useDicomData } from "../features/workList/useDicomData";
import Logo from "../ui/Logo";

const { ViewportType } = cornerstone.Enums;

function Viewer() {
  const { examId } = useParams();
  const {
    isLoading: isLoadingDicomBlobData,
    error: errorDicomBlobData,
    dicomBlob: dicomBlobData,
  } = useDicomData(examId);

  const renderingEngineRef = useRef(null);
  const containerRef = useRef(null);
  const toolGroupRef = useRef(null);
  const viewportRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTool, setActiveTool] = useState("WindowLevel"); // Default active tool for left click

  const extractDicomFiles = async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const dataView = new DataView(arrayBuffer); // Use DataView for reading integers
      const dicomFiles = [];

      let currentIndex = 0;

      while (currentIndex < arrayBuffer.byteLength) {
        if (currentIndex + 4 > arrayBuffer.byteLength) {
          console.log("Incomplete length prefix at end of blob");
          break;
        }

        // Read 4-byte big-endian unsigned length // false for big-endian
        const length = dataView.getUint32(currentIndex, false);
        currentIndex += 4;

        if (length === 0) continue; // Skip empty files

        if (currentIndex + length > arrayBuffer.byteLength) {
          throw new Error("Invalid length: exceeds blob size");
        }

        const fileData = new Uint8Array(arrayBuffer, currentIndex, length);

        // Validate as DICOM
        if (fileData.length > 132) {
          const dicmCheck = new TextDecoder().decode(fileData.slice(128, 132));
          if (dicmCheck === "DICM") {
            const fileBlob = new Blob([fileData], {
              type: "application/dicom",
            });
            dicomFiles.push(fileBlob);
          } else {
            console.log("Segment skipped: missing DICM signature");
          }
        } else {
          console.log("Segment skipped: too short for DICOM");
        }

        currentIndex += length;
      }

      console.log(`Extracted ${dicomFiles.length} DICOM files from blob`);
      return dicomFiles;
    } catch (error) {
      console.log("Error extracting DICOM files:", error);
      throw error;
    }
  };

  useEffect(() => {
    async function initializeCornerstone() {
      try {
        // Check if already initialized
        if (isInitialized) return;

        // Inside initializeCornerstone
        console.log("Initializing Cornerstone...");

        // Initialize cornerstone core
        await cornerstone.init();
        console.log("Cornerstone core initialized");

        // Initialize DICOM image loader
        cornerstoneDICOMImageLoader.init();
        console.log("DICOM Image Loader initialized");

        // Initialize tools after cornerstone and image loader
        await cornerstoneTools.init();
        console.log("Cornerstone Tools initialized");

        // Add tools - check if they exist before adding
        const { PanTool, WindowLevelTool, StackScrollTool, ZoomTool, addTool } =
          cornerstoneTools;

        console.log("Available tools:", {
          PanTool: !!PanTool,
          WindowLevelTool: !!WindowLevelTool,
          StackScrollTool: !!StackScrollTool,
          ZoomTool: !!ZoomTool,
          addTool: !!addTool,
        });

        // Add available tools
        if (PanTool && addTool) {
          addTool(PanTool);
          console.log("PanTool added");
        }
        if (WindowLevelTool && addTool) {
          addTool(WindowLevelTool);
          console.log("WindowLevelTool added");
        }
        if (ZoomTool && addTool) {
          addTool(ZoomTool);
          console.log("ZoomTool added");
        }
        if (StackScrollTool && addTool) {
          addTool(StackScrollTool);
          console.log("StackScrollTool added");
        }

        setIsInitialized(true);
        console.log("Cornerstone initialized successfully");
      } catch (error) {
        console.log("Failed to initialize Cornerstone:", error);
        setImageError(`Failed to initialize DICOM viewer: ${error.message}`);
      }
    }

    initializeCornerstone();
  }, [isInitialized]);

  // Update tool activations when activeTool changes
  useEffect(() => {
    const toolGroup = toolGroupRef.current;
    if (!toolGroup) return;

    const { Enums: csToolsEnums } = cornerstoneTools;

    // Set interaction tools to passive
    toolGroup.setToolPassive("WindowLevel");
    toolGroup.setToolPassive("Pan");
    toolGroup.setToolPassive("Zoom");

    // Activate the selected tool on primary mouse button
    toolGroup.setToolActive(activeTool, {
      bindings: [
        {
          mouseButton: csToolsEnums.MouseBindings.Primary, // Left click
        },
      ],
    });

    // Always keep stack scroll active (for mouse wheel)
    toolGroup.setToolActive("StackScroll", {
      bindings: [
        {
          mouseButton: csToolsEnums.MouseBindings.Wheel,
        },
      ],
    });
  }, [activeTool]);

  useEffect(() => {
    async function initializeViewer() {
      if (!dicomBlobData || !containerRef.current || !isInitialized) return;

      // Check if examId is valid
      if (!examId || examId === "undefined") {
        setImageError("Invalid exam ID");
        return;
      }

      setLoadingImages(true);
      setImageError(null);

      try {
        // Extract individual DICOM files from the blob
        const dicomFiles = await extractDicomFiles(dicomBlobData);

        if (dicomFiles.length === 0) {
          throw new Error("No valid DICOM files found in the blob");
        }

        // Create rendering engine
        const renderingEngineId = "myRenderingEngine";
        if (renderingEngineRef.current) {
          renderingEngineRef.current.destroy();
        }
        renderingEngineRef.current = new cornerstone.RenderingEngine(
          renderingEngineId
        );

        // Create viewport
        const viewportId = "ctViewport";
        const element = containerRef.current;

        const viewportInput = {
          viewportId,
          element,
          type: ViewportType.STACK,
        };

        renderingEngineRef.current.enableElement(viewportInput);

        // Store viewport reference
        viewportRef.current =
          renderingEngineRef.current.getViewport(viewportId);

        // Create tool group
        const toolGroupId = "STACK_TOOL_GROUP_ID";

        // Destroy existing tool group if it exists
        if (toolGroupRef.current) {
          try {
            cornerstoneTools.ToolGroupManager.destroyToolGroup(
              toolGroupRef.current.id
            );
          } catch (error) {
            console.log("Error destroying existing tool group:", error);
          }
        }

        // Create new tool group
        toolGroupRef.current =
          cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

        // Get available tools
        const {
          PanTool,
          WindowLevelTool,
          StackScrollTool,
          ZoomTool,
          Enums: csToolsEnums,
        } = cornerstoneTools;

        // Add tools to tool group - check if they exist
        if (PanTool) {
          toolGroupRef.current.addTool(PanTool.toolName);
        }
        if (WindowLevelTool) {
          toolGroupRef.current.addTool(WindowLevelTool.toolName);
        }
        if (ZoomTool) {
          toolGroupRef.current.addTool(ZoomTool.toolName);
        }
        if (StackScrollTool) {
          toolGroupRef.current.addTool(StackScrollTool.toolName);
        }

        // Add viewport to tool group
        toolGroupRef.current.addViewport(viewportId, renderingEngineId);

        // Initial tool setup (triggers the useEffect above)
        // No need to set here; the useEffect will handle it based on activeTool state

        // Sort DICOM files by instance number and slice location
        const sortedFiles = await Promise.all(
          dicomFiles.map(async (file, index) => {
            try {
              const arrayBuffer = await file.arrayBuffer();
              const dataSet = dicomParser.parseDicom(
                new Uint8Array(arrayBuffer)
              );

              // Try to get instance number first
              const instanceNumber = dataSet.string("x00200013"); // Instance Number

              // Try to get slice location as fallback
              const sliceLocation = dataSet.string("x00201041"); // Slice Location

              // Try to get image position patient Z coordinate as another fallback
              const imagePositionPatient = dataSet.string("x00200032"); // Image Position Patient
              let zPosition = null;
              if (imagePositionPatient) {
                const positions = imagePositionPatient.split("\\");
                if (positions.length >= 3) {
                  zPosition = parseFloat(positions[2]);
                }
              }

              // Use instance number if available, otherwise use slice location, then z position, then original index
              let sortKey = index;
              if (instanceNumber && !isNaN(parseInt(instanceNumber))) {
                sortKey = parseInt(instanceNumber);
              } else if (sliceLocation && !isNaN(parseFloat(sliceLocation))) {
                sortKey = parseFloat(sliceLocation);
              } else if (zPosition !== null && !isNaN(zPosition)) {
                sortKey = zPosition;
              }

              return {
                file,
                sortKey,
                instanceNumber: instanceNumber || "N/A",
                sliceLocation: sliceLocation || "N/A",
                originalIndex: index,
              };
            } catch (error) {
              console.log(`Error parsing DICOM file ${index}:`, error);
              return {
                file,
                sortKey: index,
                instanceNumber: "N/A",
                sliceLocation: "N/A",
                originalIndex: index,
              };
            }
          })
        );

        // Sort by sort key
        sortedFiles.sort((a, b) => a.sortKey - b.sortKey);

        console.log(
          "DICOM files sorted:",
          sortedFiles.map((f) => ({
            originalIndex: f.originalIndex,
            instanceNumber: f.instanceNumber,
            sliceLocation: f.sliceLocation,
            sortKey: f.sortKey,
          }))
        );

        // Load DICOM images and create image IDs from sorted files
        const imageIds = [];
        for (let i = 0; i < sortedFiles.length; i++) {
          const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(
            sortedFiles[i].file
          );
          console.log(`Image ID: ${imageId}`);
          imageIds.push(imageId);
        }

        console.log(`Created ${imageIds.length} image IDs`);

        // Get viewport
        const viewport = renderingEngineRef.current.getViewport(viewportId);

        // Set the stack on the viewport
        if (imageIds.length > 0) {
          await viewport.setStack(imageIds, 0);
          viewport.render();

          console.log("DICOM images loaded successfully");
        } else {
          throw new Error("No valid image IDs created");
        }

        setLoadingImages(false);
      } catch (error) {
        console.log("Failed to initialize viewer:", error);
        setImageError(`Failed to load DICOM images: ${error.message}`);
        setLoadingImages(false);
      }
    }

    initializeViewer();

    return () => {
      // Cleanup
      if (toolGroupRef.current) {
        try {
          cornerstoneTools.ToolGroupManager.destroyToolGroup(
            toolGroupRef.current.id
          );
        } catch (error) {
          console.log("Error destroying tool group:", error);
        }
      }
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy();
      }
    };
  }, [dicomBlobData, isInitialized, examId]);

  // Debug examId
  useEffect(() => {
    console.log("Current examId:", examId);
    if (!examId || examId === "undefined") {
      console.log("ExamId is undefined or invalid");
    }
  }, [examId]);

  const handleReset = () => {
    if (!viewportRef.current) return;
    viewportRef.current.resetCamera();
    viewportRef.current.render();
  };

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      {!isInitialized && (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Initializing DICOM viewer...</div>
        </div>
      )}
      {isInitialized && (isLoadingDicomBlobData || loadingImages) && (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">
            {isLoadingDicomBlobData
              ? "Loading DICOM..."
              : "Processing DICOM files..."}
          </div>
        </div>
      )}
      {(errorDicomBlobData || imageError) && (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500 text-xl">
            Error: {errorDicomBlobData?.message || imageError}
          </div>
        </div>
      )}
      {isInitialized &&
        !isLoadingDicomBlobData &&
        !loadingImages &&
        !errorDicomBlobData &&
        !imageError && (
          <div className="flex items-center absolute top-2 left-2 z-10 space-x-2 ">
            <Logo />
            <button
              className={`px-4 py-2 rounded h-10 cursor-pointer ${
                activeTool === "WindowLevel"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setActiveTool("WindowLevel")}
            >
              Window/Level
            </button>
            <button
              className={`px-4 py-2 rounded h-10 cursor-pointer ${
                activeTool === "Pan"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setActiveTool("Pan")}
            >
              Pan
            </button>
            <button
              className={`px-4 py-2 rounded h-10 cursor-pointer ${
                activeTool === "Zoom"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setActiveTool("Zoom")}
            >
              Zoom
            </button>
            <button
              className="px-4 py-2 rounded h-10 cursor-pointer bg-white text-black"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        )}
      <div ref={containerRef} className="w-full h-full rounded border-black" />
    </div>
  );
}

export default Viewer;
