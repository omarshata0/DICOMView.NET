# DICOMView.NET

A comprehensive web application for radiologists featuring a worklist management system and medical image viewer. Built with ASP.NET Core backend, React frontend, and Microsoft SQL Server database.

## 🚀 Features

### Core Functionality

- **Secure Authentication**: JWT-based login system for radiologists
- **Exam Management**: Create, update, and track patient exams
- **Patient Database**: Comprehensive patient information management
- **Worklist Interface**: Grid-based exam history with search capabilities
- **DICOM Viewer**: Medical image viewing with basic measurement tools
- **Status Tracking**: Real-time exam status updates (Scheduled, Arrived, Canceled, Completed)

### Technical Features

- RESTful API architecture
- React-based responsive frontend
- SQL Server database with Dapper ORM
- BLOB storage for medical images
- JWT authentication and authorization
- Search and filtering capabilities

## 🛠️ Technology Stack

### Backend

- **Framework**: ASP.NET Core
- **Database**: Microsoft SQL Server
- **ORM**: Dapper
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful Web API

### Frontend

- **Framework**: React.js
- **Data Fetching**: TanStack Query (React Query)
- **Form Management**: React Hook Form
- **Styling**: TailwindCSS
- **Build Tool**: Vite

### Database

- **Primary Database**: Microsoft SQL Server
- **Image Storage**: BLOB storage in SQL Server
- **Data Access**: Dapper for efficient database operations

## 📁 Project Structure

```
DICOMView.NET/
├── frontend/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/                  # ASP.NET Core API
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── scripts/
│   │   ├── createTables.sql
│   │   ├── InsertDummyData.sql
│   │   └── dataSeed.py
│   └── ...
├── CT_data/                  # Sample CT scan data
│   └── (DICOM files for testing)
└── README.md
```

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **.NET 6.0 or later** - [Download](https://dotnet.microsoft.com/download)
- **Node.js 16+ and npm** - [Download](https://nodejs.org/)
- **Microsoft SQL Server** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Python 3.8+** (for data seeding script)
- **Git** - [Download](https://git-scm.com/)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DICOMView.NET.git
cd DICOMView.NET
```

### 2. Database Setup

#### Create Database Tables

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Execute the table creation script:

```sql
-- Create the WorkListTask database and tables
-- File location: /backend/scripts/createTables.sql
```

#### Insert Dummy Data

```sql
-- Execute the dummy data script
-- File location: /backend/scripts/InsertDummyData.sql
```

#### Seed CT Data

```bash
# Navigate to backend scripts directory
cd backend/scripts

# Install Python dependencies
pip install pyodbc pydicom

# Run the data seeding script to populate DicomStudyBlob
python dataSeed.py
```

### 3. Backend Configuration

#### Update Connection String

1. Navigate to `/backend/appsettings.json`
2. Update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WorkListTask;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "DICOMView.NET",
    "Audience": "DICOMView.NET"
  }
}
```

#### Run Backend

```bash
# Navigate to backend directory
cd backend

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run or dotnet watch run
```

The API will be available at `https://localhost:5190` (or the port specified in your configuration).

### 4. Frontend Configuration

#### Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Key dependencies that should be installed:
# npm install react-query @tanstack/react-query
# npm install react-hook-form
......
```

#### Configure API Endpoint

Update the API base URL in your frontend configuration (typically in a config file or environment variables):

```javascript
// Example configuration
const API_BASE_URL = "https://localhost:5190/api";
```

#### Run Frontend

```bash
# Start the development server
npm start
```

The frontend will be available at `http://localhost:5173`.

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth` - Checks Authentication State
- `GET /api/auth/user` - Get user details
- `POST /api/auth/logout` - User logout

### Exams

- `POST /api/exams/create` - Create new exam
- `GET /api/exams/{examId}` - Get one exam
- `PUT /api/exams/{examId}` - Update exam
- `DELETE /api/exams/{examId}` - Delete exam
- `GET /api/exams` - Get all exams
- `GET /api/exams/{examId}/dicom` - Get DICOM data

### Patients

- `GET /api/patients` - Get all patients

## 🎯 Usage

### 1. Login

- Access the application at `http://localhost:5173`
- Use the provided credentials from the dummy data or register a new account

### 2. Create New Exam

- Click "Add New Exam" 
- Fill in patient details (ID, Name, Gender, Birthdate, Email)
- Specify exam type (CT Brain, Chest X-Ray, etc.)
- Set date, time, and comments
- Select exam status

### 3. View Worklist

- Access the worklist to see all patient exams
- Use search functionality to filter by patient ID, name, or exam date
- View exam details in grid format

### 4. DICOM Viewer

- Double-click on any exam to open the viewer
- View medical images with basic measurement tools
- Navigate through image series

## 🗄️ Database Schema

The application uses three main tables in the `WorkListTask` database:

### Users Table

- **UserId** (INT, Primary Key, Identity): Unique user identifier
- **Username** (VARCHAR(50), Unique): User login name
- **PasswordHash** (VARCHAR(255)): Hashed password for security
- **Email** (VARCHAR(100), Unique): User email address
- **FullName** (VARCHAR(100)): User's full name
- **CreatedDate** (DATETIME): Account creation timestamp

### Patients Table

- **PatientId** (INT, Primary Key, Identity): Unique patient identifier
- **PatientName** (VARCHAR(100)): Patient's full name
- **Birthdate** (DATE): Patient's date of birth
- **Gender** (CHAR(1)): Patient gender (M/F)
- **Email** (VARCHAR(100), Unique): Patient email address
- **CreatedDate** (DATETIME): Record creation timestamp

### Exams Table

- **ExamId** (INT, Primary Key, Identity): Unique exam identifier
- **PatientId** (INT, Foreign Key): Reference to Patients table
- **ExamType** (VARCHAR(100)): Type of exam (CT Brain, Chest X-Ray, etc.)
- **ExamDate** (DATETIME): Scheduled exam date and time
- **ExamTime** (TIME): Specific exam time
- **Status** (VARCHAR(20)): Exam status (Scheduled, Arrived, Cancelled, Completed)
- **Comments** (TEXT): Additional exam notes
- **DicomStudyBlob** (VARBINARY(MAX)): DICOM image data stored as binary blob
- **CreatedDate** (DATETIME): Record creation timestamp

---

**Note**: This application is designed for educational and development purposes. For production use in healthcare environments, ensure compliance with relevant regulations (HIPAA, GDPR, etc.) and implement additional security measures.
