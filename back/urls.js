const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const api = require('./api');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/login-centre', api.loginCentre);

// PI route accepts 'pdf' field as file
router.post('/pi', upload.single('pdf'), api.createPIRecord);

// Alumnes routes
router.get('/alumnes', api.getAllAlumnes);
router.get('/alumnes/:ralc', api.getAlumneByRalc);

module.exports = router;
