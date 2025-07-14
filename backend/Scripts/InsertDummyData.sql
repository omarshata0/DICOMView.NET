
-- Insert dummy data into Users table
INSERT INTO Users (Username, PasswordHash, Email, RefreshToken, RefreshTokenExpiryTime) VALUES
('radiologist1', 'hashedpassword1', 'radiologist1@hospital.com', NULL, NULL),
('radiologist2', 'hashedpassword2', 'radiologist2@hospital.com', NULL, NULL);

-- Insert dummy data into Patients table
INSERT INTO Patients (PatientName, Birthdate, Gender, Email) VALUES
('Kamel', '1976-03-28', 'F', 'flina@example.com'),
('Ahmed', '1920-04-03', 'F', 'tbya@example.com'),
('Doug Heavyblaze', '1997-07-02', 'M', 'doug@example.com'),
('Kamel', '1985-02-02', 'F', 'legtana@example.com'),
('Omar', '1966-11-05', 'M', 'fundaovno@example.com'),
('Torsade', '2015-12-14', 'F', 'torsade@example.com'),
('Darin Mostafa Kamel', '1993-03-03', 'F', 'darin@example.com'),
('Ali Mostafa', '1993-03-03', 'F', 'ali@example.com'),
('Omar Ahmed Mostafa', '1993-04-04', 'F', 'omar@example.com'),
('Ahmed Mostafa', '1980-09-17', 'M', 'ahmed@example.com');

INSERT INTO Exams (PatientId, ExamType, ExamDate, Status, Comments) VALUES
-- Today (July 14, 2025)
(1, 'Brain MRI', '2025-07-14 10:00:00', 'Scheduled', 'Neurological evaluation'),
(2, 'Chest X-ray', '2025-07-14 15:30:00', 'Completed', 'Routine lung check'),

-- Yesterday (July 13, 2025)
(3, 'Head CT', '2025-07-13 09:15:00', 'Completed', 'Post-trauma scan'),
(4, 'Abdominal Ultrasound', '2025-07-13 14:20:00', 'Arrived', 'Abdominal pain check'),

-- Last Week (July 7–13, 2025)
(5, 'Spine MRI', '2025-07-10 11:45:00', 'Completed', 'Chronic back pain'),
(6, 'Pelvic Ultrasound', '2025-07-12 16:00:00', 'Scheduled', 'Pelvic mass evaluation'),

-- Last Month (June 14–July 13, 2025)
(7, 'Chest CT', '2025-06-15 08:00:00', 'Completed', 'Lung infection follow-up'),
(8, 'Mammogram', '2025-06-20 13:30:00', 'Scheduled', 'Breast screening'),
(9, 'Knee X-ray', '2025-07-01 10:10:00', 'Arrived', 'Knee injury assessment'),
(10, 'Whole Body PET-CT', '2025-06-30 17:00:00', 'Completed', 'Cancer staging');

