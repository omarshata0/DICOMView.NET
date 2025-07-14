-- Creating the WorkListTask database
CREATE DATABASE WorkListTask;
GO

USE WorkListTask;
GO

-- Users table for authentication with refresh token fields
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    RefreshToken VARCHAR(255) NULL,
    RefreshTokenExpiryTime DATETIME NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);


-- Patients table
CREATE TABLE Patients (
    PatientId INT PRIMARY KEY IDENTITY(1,1),
    PatientName VARCHAR(100) NOT NULL,
    Birthdate DATE NOT NULL,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')),
    Email VARCHAR(100) UNIQUE,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Exams table without ExamTime column
CREATE TABLE Exams (
    ExamId INT PRIMARY KEY IDENTITY(1,1),
    PatientId INT FOREIGN KEY REFERENCES Patients(PatientId),
    ExamType VARCHAR(100) NOT NULL,
    ExamDate DATETIME2 NOT NULL, -- Stores full timestamp (date and time)
    Status VARCHAR(20) CHECK (Status IN ('Scheduled', 'Arrived', 'Cancelled', 'Completed')),
    Comments TEXT,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- ExamBlob table to store DICOM blobs
CREATE TABLE ExamBlob (
    ExamBlobId INT PRIMARY KEY IDENTITY(1,1),
    ExamId INT FOREIGN KEY REFERENCES Exams(ExamId),
    DicomStudyBlob VARBINARY(MAX) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);
