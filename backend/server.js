// Author: Himanshu Tripathi
// Department: AI and DS
// Description: Main Entry Point - SmartCampus Enterprise SaaS Engine

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet'); // Security enhancement
const compression = require('compression'); // Performance optimization
const connectDB = require('./config/db'); 
const apiRoutes = require('./routes/apiRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// ⚡ Global Middlewares & Security Layers
// =========================================================================
app.use(helmet()); // Sets various HTTP headers for security
app.use(compression()); // Compresses response bodies for faster loading
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for heavy data payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

// =========================================================================
// 🌐 CONNECT API ROUTES PIPELINE
// =========================================================================
app.use('/api', apiRoutes);

// Root heartbeat check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "SmartCampus Enterprise Multi-Tenant SaaS Engine Operational",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date()
    });
});

// =========================================================================
// 🛡️ GLOBAL ENTERPRISE ERROR CATCH MATRIX
// =========================================================================
// Handle 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Routing Layer Exception: Endpoint [${req.originalUrl}] not discovered.`
    });
});

// Handle Global Errors
app.use((err, req, res, next) => {
    console.error(`🚨 CRITICAL FAULT ON PORTAL STREAM: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Engine Context Isolation Exception'
    });
});

// =========================================================================
// 🏃‍♂️ Engine Boot-up Controller
// =========================================================================
const initializeEnterpriseServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`=========================================`);
            console.log(`🚀 SAAS SERVER INITIALIZATION SUCCESSFUL`);
            console.log(`LISTENING ON PORT: http://localhost:${PORT}`);
            console.log(`ENVIRONMENT: ${process.env.NODE_ENV || 'DEVELOPMENT'}`);
            console.log(`=========================================`);
        });
    } catch (criticalError) {
        console.error(`❌ STACK DEPLOYMENT ABORTED: ${criticalError.message}`);
        process.exit(1); 
    }
};

initializeEnterpriseServer();