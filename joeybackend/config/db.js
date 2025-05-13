const mysql = require('mysql2');
const express = require('express');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'mydb'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected!');
});

module.exports = db;




// const app = express();

// //create db
// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE mydb';
//     db.query(sql, (err,result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Database created...');
//     })
// })


// // Create Visitor Table
// app.get('/VisitorTable', (req, res) => {
//     let sql = `
//         CREATE TABLE visitor (
//             VisitorID INT AUTO_INCREMENT PRIMARY KEY,
//             Username VARCHAR(50) NOT NULL UNIQUE,
//             Email VARCHAR(255) NOT NULL UNIQUE,
//             Password VARCHAR(255) NOT NULL,
//             Role VARCHAR(50) DEFAULT 'Visitor'
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Visitor table created...');
//     });
// });

// //create park guide table
// app.get('/ParkGuideTable', (req, res) => {
//     let sql = `
//         CREATE TABLE park_guide (
//             ParkGuideID INT AUTO_INCREMENT PRIMARY KEY,
//             Username VARCHAR(50) NOT NULL UNIQUE,
//             Fullname VARCHAR (255) NOT NULL,
//             Email VARCHAR(255) NOT NULL UNIQUE,
//             Password VARCHAR(255) NOT NULL,
//             Status ENUM ('Inactive', 'Active') DEFAULT 'Inactive' NOT NULL,
//             Role ENUM ('Trainee', 'Park Guide', 'Mentor' ) DEFAULT 'Trainee' NOT NULL
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Park guide table created...');
//     });
// });

// //create admin table
// app.get('/AdminTable', (req, res) => {
//     let sql = `
//         CREATE TABLE admin (
//             AdminID INT AUTO_INCREMENT PRIMARY KEY,
//             Username VARCHAR(50) NOT NULL UNIQUE,
//             Email VARCHAR(255) NOT NULL UNIQUE,
//             Password VARCHAR(255) NOT NULL,
//             Role VARCHAR(50) DEFAULT 'Admin'
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Admin table created...');
//     });
// });


// //Create OTP Table
// app.get('/OTPTable', (req, res) => {
//     let sql = `
//         CREATE TABLE otp_verification (
//             username VARCHAR(255),
//             otp VARCHAR(6),
//             expires_at DATETIME,
//             PRIMARY KEY (username)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('OTP table created...');
//     });
// });


// // Create Module Table
// app.get('/ModuleTable', (req, res) => {
//     let sql = `
//         CREATE TABLE module (
//             Module_code VARCHAR(50) NOT NULL UNIQUE,
//             Module_name VARCHAR(50) NOT NULL UNIQUE,
//             Module_description VARCHAR(255),
//             PRIMARY KEY (Module_code)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Module table created...');
//     });
// });


// // Create Guide_Module Table
// app.get('/Guide_ModuleTable', (req, res) => {
//     let sql = `
//         CREATE TABLE Guide_Module (
//             ParkGuideID INT NOT NULL,
//             AdminID INT NOT NULL,
//             Module_Code VARCHAR(255) NOT NULL,
//             RegistrationStatus ENUM('Registered', 'Unsuccessful') NULL,
//             PaymentStatus ENUM('Success', 'Failed') NULL,
//             ProgressStatus ENUM('In Progress', 'Completed', 'Expired') NULL,
//             Result ENUM('Pass', 'Failed') NULL,
//             Start_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             Completed_Date TIMESTAMP NULL,
//             PRIMARY KEY (ParkGuideID, Module_Code),
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID),
//             FOREIGN KEY (AdminID) REFERENCES admin(AdminId),
//             FOREIGN KEY (Module_Code) REFERENCES Module(Module_Code)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Guide_Module table created...');
//     });
// });

// app.get('/TrackModuleProgressTable', (req, res) => {
//     let sql = `
//         CREATE TABLE track_module_progress (
//             ParkGuideID INT NOT NULL,
//             AdminID INT NOT NULL,
//             Module_Code VARCHAR(255) NOT NULL,
//             percentage VARCHAR (255) NOT NULL,
//             PRIMARY KEY (ParkGuideID, Module_Code),
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID),
//             FOREIGN KEY (AdminID) REFERENCES admin(AdminId),
//             FOREIGN KEY (Module_Code) REFERENCES Module(Module_Code)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Guide_Module table created...');
//     });
// });


// // Create Mentor Table
// app.get('/MentorTable', (req, res) => {
//     let sql = `
//         CREATE TABLE mentor (
//             MentorID INT PRIMARY KEY AUTO_INCREMENT,
//             FullName VARCHAR(100) NOT NULL,
//             Email VARCHAR(100) NOT NULL UNIQUE,
//             AvailabilityStatus ENUM('Available', 'Unavailable') DEFAULT 'Available'
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Mentor table created...');
//     });
// });

// //Create Booking Table
// app.get('/BookingMentorTable', (req, res) => {
//     let sql = `
//         CREATE TABLE booking_mentor (
//             BookingID INT PRIMARY KEY AUTO_INCREMENT,
//             ParkGuideID INT NOT NULL,
//             MentorID INT NOT NULL,
//             BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             SessionDate DATE NOT NULL,
//             Status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID),
//             FOREIGN KEY (MentorID) REFERENCES mentor(MentorID)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Booking mentor table created...');
//     });
// });

// app.get('/BookingParkGuideTable', (req, res) => {
//     let sql = `
//         CREATE TABLE booking_parkguide (
//             BookingID INT PRIMARY KEY AUTO_INCREMENT,
//             ParkGuideID INT NOT NULL,
//             VisitorID INT NOT NULL,
//             name VARCHAR(255) NOT NULL,
//             email VARCHAR(255) NOT NULL,
//             contact INT(12) NOT NULL,
//             date DATE NOT NULL,
//             timeSlot VARCHAR(255) NOT NULL,
//             guide VARCHAR(255) NOT NULL,
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID),
//             FOREIGN KEY (VisitorID) REFERENCES visitor(VisitorID)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Booking park guide table created...');
//     });
// });

// Create License Table
// app.get('/LicenseTable', (req, res) => {
//     let sql = `
//         CREATE TABLE License (
//             LicenseID INT PRIMARY KEY AUTO_INCREMENT,
//             ParkGuideID INT NOT NULL,
//             AdminID INT NOT NULL,
//             LicensetypeID NOT NULL,
//             Approval_status ENUM ('Approved', 'Pending', 'Rejected') NOT NULL,
//             Expiry_date DATE NULL,
//             Hire_Date DATE NULL,
//             License_status ENUM ('Expired', 'Active') NOT NULL, 
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID),
//             FOREIGN KEY (AdminID) REFERENCES admin(AdminID),
//             FOREIGN KEY (LicensetypeID) REFERENCES License_type(LicensetypeID)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('License table created...');
//     });
// });

// // Create License type Table
// app.get('/LicenseTypeTable', (req, res) => {
//     let sql = `
//         CREATE TABLE License_type (
//             LicensetypeID INT PRIMARY KEY AUTO_INCREMENT,
//             License_type ENUM ('Bako', 'Semenggoh','Kubah', 'Tanjung Datu', 'Batang Ai' ) NOT NULL       
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('License Type table created...');
//     });
// });


// // Create Feedback Table
// app.get('/FeedbackTable', (req, res) => {
//     let sql = `
//         CREATE TABLE Feedback (
//             FeedbackID INT PRIMARY KEY AUTO_INCREMENT,
//             ParkGuideID INT NOT NULL,
//             Rating_S1Q1 INT CHECK (Rating_S1Q1 BETWEEN 1 AND 5),
//             Rating_S1Q2 INT CHECK (Rating_S1Q2 BETWEEN 1 AND 5),
//             Rating_S1Q3 INT CHECK (Rating_S1Q3 BETWEEN 1 AND 5),
//             Rating_S2Q1 INT CHECK (Rating_S2Q1 BETWEEN 1 AND 5),
//             Rating_S2Q2 INT CHECK (Rating_S2Q2 BETWEEN 1 AND 5),
//             Rating_S2Q3 INT CHECK (Rating_S2Q3 BETWEEN 1 AND 5),
//             Rating_S3Q1 INT CHECK (Rating_S3Q1 BETWEEN 1 AND 5),
//             Rating_S3Q2 INT CHECK (Rating_S3Q2 BETWEEN 1 AND 5),
//             Rating_S3Q3 INT CHECK (Rating_S3Q3 BETWEEN 1 AND 5), 
//             Comment TEXT NULL,
//             Rating_Section1 FLOAT GENERATED ALWAYS AS (Rating_S1Q1 + Rating_S1Q2 + Rating_S1Q3) STORED,
//             Rating_Section2 FLOAT GENERATED ALWAYS AS (Rating_S2Q1 + Rating_S2Q2 + Rating_S2Q3) STORED,
//             Rating_Section3 FLOAT GENERATED ALWAYS AS (Rating_S3Q1 + Rating_S3Q2 + Rating_S3Q3) STORED,
//             Rating_Overall FLOAT GENERATED ALWAYS AS ((Rating_Section1 + Rating_Section2 + Rating_Section3) / 3) STORED,
//             Feedback_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (ParkGuideID) REFERENCES park_guide(ParkGuideID)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Feedback table created...');
//     });
// });


// // Create Plant Table
// app.get('/PlantTable', (req, res) => {
//     let sql = `
//         CREATE TABLE Plant (
//             PlantID INT PRIMARY KEY AUTO_INCREMENT,
//             ScientificName VARCHAR(100) NOT NULL UNIQUE,
//             CommonName VARCHAR(100) NOT NULL,
//             Family VARCHAR(100) NOT NULL,
//             Subfamily VARCHAR(100) NOT NULL,
//             Description TEXT NOT NULL,
//             Habitat TEXT NOT NULL,
//             Distribution TEXT NOT NULL,
//             ImageURL VARCHAR(255) NOT NULL
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Plant table created...');
//     });
// });


// // Create IoT_Database Table
// app.get('/IoTDatabaseTable', (req, res) => {
//     let sql = `
//         CREATE TABLE IoT_Database (
//             IoT_id INT PRIMARY KEY AUTO_INCREMENT,
//             IoT_name VARCHAR(100) NOT NULL,
//             IoT_type VARCHAR(100) NOT NULL,
//             Status ENUM('active', 'inactive') DEFAULT 'active',
//             Actual_reading_value VARCHAR(100),
//             Date_time DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('IoT_Database table created...');
//     });
// });

// // Create SensorReadings Table
// app.get('/SensorReadingsTable', (req, res) => {
//     let sql = `
//         CREATE TABLE SensorReadings (
//             Reading_id INT PRIMARY KEY AUTO_INCREMENT,
//             IoT_id INT NOT NULL,
//             Reading_value VARCHAR(100),
//             Reading_type VARCHAR(100),
//             Recorded_time DATETIME DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (IoT_id) REFERENCES IoT_Database(IoT_id)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('SensorReadings table created...');
//     });
// });

// // Create ThreatAlerts Table
// app.get('/ThreatAlertsTable', (req, res) => {
//     let sql = `
//         CREATE TABLE ThreatAlerts (
//             Event_id INT PRIMARY KEY AUTO_INCREMENT,
//             IoT_id INT NOT NULL,
//             Event_type VARCHAR(100),
//             Threat_level ENUM('low', 'medium', 'high') NOT NULL,
//             Event_time DATETIME DEFAULT CURRENT_TIMESTAMP,
//             Is_alert BOOLEAN DEFAULT FALSE,
//             Alert_message TEXT,
//             Sent_time DATETIME,
//             Status ENUM('unread', 'read', 'acknowledged') DEFAULT 'unread',
//             FOREIGN KEY (IoT_id) REFERENCES IoT_Database(IoT_id)
//         )
//     `;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('ThreatAlerts table created...');
//     });
// });


// app.listen('5000', () => {
//     console.log('Server started on port 5000');
// });
