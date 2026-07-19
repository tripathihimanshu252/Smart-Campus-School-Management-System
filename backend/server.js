// Author: Himanshu Tripathi
// Department: AI and DS
// Description: Main Entry Point - SmartCampus Enterprise SaaS Engine

// 🔥 SABSE PEHLE DOTENV LOAD KARO
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db'); 
const apiRoutes = require('./routes/apiRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// ⚡ Global Middlewares & Security Layers
// =========================================================================
app.use(helmet()); 
app.use(compression()); 
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); 
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
            console.log(`LISTENING ON PORT: ${PORT}`);
            console.log(`ENVIRONMENT: ${process.env.NODE_ENV || 'DEVELOPMENT'}`);
            console.log(`=========================================`);
        });
    } catch (criticalError) {
        console.error(`❌ STACK DEPLOYMENT ABORTED: ${criticalError.message}`);
        process.exit(1); 
    }
};

initializeEnterpriseServer();