import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import * as cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";
import { useDicomData } from "../features/workList/useDicomData";

const { ViewportType } = cornerstone.Enums;

function Viewer() {
  const { examId } = useParams();
  const {
    isLoading: isLoadingDicomBlobData,
    error: errorDicomBlobData,
    dicomBlob: dicomBlobData,
  } = useDicomData({ examId });

  const renderingEngineRef = useRef(null);
  const containerRef = useRef(null);
  const toolGroupRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Function to extract individual DICOM files from the concatenated blob
  const extractDicomFiles = async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const dicomFiles = [];

      let currentIndex = 0;
      const delimiter = new Uint8Array([0x00, 0x00, 0x00, 0x00]);

      while (currentIndex < uint8Array.length) {
        // Find the next delimiter
        let delimiterIndex = -1;
        for (let i = currentIndex; i <= uint8Array.length - 4; i++) {
          if (
            uint8Array[i] === 0x00 &&
            uint8Array[i + 1] === 0x00 &&
            uint8Array[i + 2] === 0x00 &&
            uint8Array[i + 3] === 0x00
          ) {
            delimiterIndex = i;
            break;
          }
        }

        let endIndex;
        if (delimiterIndex !== -1) {
          endIndex = delimiterIndex;
        } else {
          // Last file or no delimiter found
          endIndex = uint8Array.length;
        }

        if (endIndex > currentIndex) {
          const fileData = uint8Array.slice(currentIndex, endIndex);

          // Validate that this looks like a DICOM file
          if (fileData.length > 132) {
            // Check for DICOM prefix at position 128
            const dicmCheck = new TextDecoder().decode(
              fileData.slice(128, 132)
            );
            if (dicmCheck === "DICM") {
              const blob = new Blob([fileData], { type: "application/dicom" });
              dicomFiles.push(blob);
            }
          }
        }

        currentIndex =
          delimiterIndex !== -1 ? delimiterIndex + 4 : uint8Array.length;
      }

      console.log(`Extracted ${dicomFiles.length} DICOM files from blob`);
      return dicomFiles;
    } catch (error) {
      console.error("Error extracting DICOM files:", error);
      throw error;
    }
  };

  useEffect(() => {
    async function initializeCornerstone() {
      try {
        // Initialize cornerstone
        await cornerstone.init();

        // Initialize tools
        await cornerstoneTools.init();

        // Configure DICOM image loader
        cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
        cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
        cornerstoneDICOMImageLoader.configure({
          useWebWorkers: true,
          decodeConfig: {
            convertFloatPixelDataToInt: false,
          },
        });

        // Add tools
        const {
          PanTool,
          WindowLevelTool,
          StackScrollMouseWheelTool,
          ZoomTool,
          addTool,
        } = cornerstoneTools;

        // Add available tools
        if (PanTool) addTool(PanTool);
        if (WindowLevelTool) addTool(WindowLevelTool);
        if (ZoomTool) addTool(ZoomTool);
        if (StackScrollMouseWheelTool) addTool(StackScrollMouseWheelTool);

        console.log("Cornerstone initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Cornerstone:", error);
        setImageError("Failed to initialize DICOM viewer");
      }
    }

    initializeCornerstone();
  }, []);

  useEffect(() => {
    async function initializeViewer() {
      if (!dicomBlobData || !containerRef.current) return;

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

        // Create tool group
        const toolGroupId = "STACK_TOOL_GROUP_ID";

        // Destroy existing tool group if it exists
        if (toolGroupRef.current) {
          try {
            cornerstoneTools.ToolGroupManager.destroyToolGroup(
              toolGroupRef.current.id
            );
          } catch (error) {
            console.warn("Error destroying existing tool group:", error);
          }
        }

        toolGroupRef.current =
          cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

        // Get available tools
        const {
          PanTool,
          WindowLevelTool,
          StackScrollMouseWheelTool,
          ZoomTool,
          Enums: csToolsEnums,
        } = cornerstoneTools;

        // Add tools to tool group
        if (PanTool) toolGroupRef.current.addTool(PanTool.toolName);
        if (WindowLevelTool)
          toolGroupRef.current.addTool(WindowLevelTool.toolName);
        if (ZoomTool) toolGroupRef.current.addTool(ZoomTool.toolName);
        if (StackScrollMouseWheelTool)
          toolGroupRef.current.addTool(StackScrollMouseWheelTool.toolName);

        // Set tool modes
        if (WindowLevelTool && csToolsEnums) {
          toolGroupRef.current.setToolActive(WindowLevelTool.toolName, {
            bindings: [
              {
                mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
              },
            ],
          });
        }

        if (PanTool && csToolsEnums) {
          toolGroupRef.current.setToolActive(PanTool.toolName, {
            bindings: [
              {
                mouseButton: csToolsEnums.MouseBindings.Auxiliary, // Middle Click
              },
            ],
          });
        }

        if (ZoomTool && csToolsEnums) {
          toolGroupRef.current.setToolActive(ZoomTool.toolName, {
            bindings: [
              {
                mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
              },
            ],
          });
        }

        // Activate scroll tool for multi-slice navigation
        if (StackScrollMouseWheelTool) {
          toolGroupRef.current.setToolActive(
            StackScrollMouseWheelTool.toolName
          );
        }

        // Add viewport to tool group
        toolGroupRef.current.addViewport(viewportId, renderingEngineId);

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
              console.warn(`Error parsing DICOM file ${index}:`, error);
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
          imageIds.push(imageId);
        }

        console.log(`Created ${imageIds.length} image IDs`);

        // Get viewport
        const viewport = renderingEngineRef.current.getViewport(viewportId);

        // Set the stack on the viewport
        if (imageIds.length > 0) {
          await viewport.setStack(imageIds, 0); // Start with the first image
          viewport.render();

          console.log("DICOM images loaded successfully");
        } else {
          throw new Error("No valid image IDs created");
        }

        setLoadingImages(false);
      } catch (error) {
        console.error("Failed to initialize viewer:", error);
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
          console.error("Error destroying tool group:", error);
        }
      }
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy();
      }
    };
  }, [dicomBlobData]);

  return (
    <div className="h-screen w-screen bg-gray-900">
      {(isLoadingDicomBlobData || loadingImages) && (
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
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ backgroundColor: "black" }}
      />
    </div>
  );
}

export default Viewer;
