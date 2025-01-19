const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Constants
const PORT = process.env.PORT || 3000;
const DEFAULT_PHOTO = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

// Initialize Express app
const app = express();

// Middleware Configuration
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Request Logger Middleware
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Profile Data Validation
const validateProfileData = (data) => {
    if (!data) {
        throw new Error('No data provided');
    }

    const requiredFields = ['userName', 'userEmail'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (data.userEmail && !data.userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email format');
    }

    if (data.userPhone && !data.userPhone.match(/^\+?[\d\s-()]+$/)) {
        throw new Error('Invalid phone number format');
    }
};

// Initialize profile data
let profileData = {
    id: "usr_001",
    userName: "John",
    lastName: "Doe",
    userPhone: "+1 (555) 123-4567",
    userEmail: "john.doe@example.com",
    userSkills: "JavaScript, Python, React, Node.js, SQL, AWS, Docker, Git",
    userDescription: "Senior Full Stack Developer with 5+ years of experience in building scalable web applications. Passionate about clean code and modern technologies.",
    profilePhoto: DEFAULT_PHOTO,
    educationContainer: [],
    experienceContainer: [],
    projectsContainer: [],
    socialMediaContainer: []
};

// Helper function to sanitize arrays
const sanitizeArray = (arr) => Array.isArray(arr) ? arr : [];

// Profile Routes
app.get('/api/profile', (req, res, next) => {
    try {
        res.json({
            success: true,
            data: profileData
        });
    } catch (error) {
        next(error);
    }
});

app.post('/api/profile', (req, res, next) => {
    try {
        const data = req.body;
        console.log('Received profile update request');

        // Validate input data
        validateProfileData(data);

        // Update profile data with sanitization
        profileData = {
            ...profileData,
            userName: data.userName.trim(),
            lastName: (data.lastName || '').trim(),
            userDescription: (data.userDescription || '').trim(),
            userEmail: data.userEmail.trim(),
            userPhone: (data.userPhone || '').trim(),
            profilePhoto: data.profilePhoto || DEFAULT_PHOTO,
            userSkills: (data.userSkills || '').trim(),
            educationContainer: sanitizeArray(data.educationContainer),
            experienceContainer: sanitizeArray(data.experienceContainer),
            projectsContainer: sanitizeArray(data.projectsContainer),
            socialMediaContainer: sanitizeArray(data.socialMediaContainer)
        };

        console.log('Profile updated successfully');
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: profileData
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// Apply Middleware
app.use(requestLogger);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log(` - GET  /api/profile (Get profile data)`);
    console.log(` - POST /api/profile (Update profile data)`);
});
