const Faculty = require('../models/Faculty'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

// 1. Get All Faculty - WITH DEBUG TRACKERS
const getAllFaculty = async (req, res) => {
    try {
        console.log("=========================================");
        console.log("👉 GET ALL FACULTY API HIT HUA!");
        console.log("👉 TOKEN KA DATA (req.user):", req.user); 

        const tenantId = req.user?.tenantId;

        // Failsafe: Agar token se tenantId nahi mila
        if (!tenantId) {
            console.log("❌ ERROR: req.user me tenantId nahi mila! Data khali jaayega.");
            console.log("=========================================");
            return res.status(200).json({ success: true, data: [], message: "No tenant context found." });
        }

        console.log(`👉 DATABASE ME SEARCH KAR RAHE HAIN TENANT: ${tenantId}`);

        const faculties = await Faculty.find({ 
            tenantId: { $regex: new RegExp(`^${tenantId}$`, 'i') } 
        }).select('-password'); 
        
        console.log(`✅ DATABASE SE TOTAL STAFF MILA: ${faculties.length}`);
        console.log("=========================================");
        
        res.status(200).json({ success: true, data: faculties });
    } catch (error) {
        console.error("🔥 Get Faculty Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Assign Subject
const updateFacultySubject = async (req, res) => {
    try {
        const { facultyId, subject } = req.body;
        if (!mongoose.Types.ObjectId.isValid(facultyId)) {
            return res.status(400).json({ success: false, message: "Invalid Faculty ID format." });
        }
        const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, { subject }, { new: true }).select('-password');
        if (!updatedFaculty) {
            return res.status(404).json({ success: false, message: "Faculty member not found." });
        }
        res.status(200).json({ success: true, data: updatedFaculty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Status Control
const updateFacultyStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format." });
        }
        const validStatuses = ['Active', 'Blocked', 'Terminated'];
        const formattedStatus = validStatuses.find(s => s.toLowerCase() === status.toLowerCase());
        if (!formattedStatus) {
            return res.status(400).json({ success: false, message: "Invalid status provided." });
        }
        const faculty = await Faculty.findByIdAndUpdate(id, { status: formattedStatus }, { new: true }).select('-password');
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty member not found." });
        }
        res.status(200).json({ success: true, message: `Status updated`, data: faculty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Permanent Delete
const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format." });
        }
        const deleted = await Faculty.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Record nahi mila database me." });
        }
        res.status(200).json({ success: true, message: "Faculty delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Staff Login (With Super Admin Bypass)
const loginStaff = async (req, res) => {
    try {
        const { email, password, tenantId } = req.body;
        
        // 🚨 BYPASS LOGIC: Direct Entry for Super Admin
        if (tenantId === 'super' && email === 'super@gmail.com' && password === '123456') {
            const token = jwt.sign(
                { id: 'super-admin-101', email: email, role: 'super-admin', tenantId: tenantId },
                process.env.JWT_SECRET || 'SESSION_JWT_NODE_VECTOR_TEST_CLUSTER-AI-DS',
                { expiresIn: '24h' }
            );
            return res.status(200).json({ 
                success: true, 
                token: token,
                user: { 
                    name: "Himanshu Tripathi", 
                    department: "AI and DS",
                    email: email, 
                    role: "super-admin" 
                }
            });
        }

        const user = await Faculty.findOne({ email, tenantId });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const userStatus = user.status ? user.status.toLowerCase() : '';
        if (userStatus === 'blocked' || userStatus === 'terminated') {
            return res.status(403).json({ success: false, message: `Account is ${user.status}. Contact Director.` });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, tenantId: user.tenantId },
            process.env.JWT_SECRET || 'SESSION_JWT_NODE_VECTOR_TEST_CLUSTER-AI-DS',
            { expiresIn: '24h' }
        );
        res.status(200).json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Register Staff (Permanent Data Save)
const registerStaff = async (req, res) => {
    try {
        const newStaff = new Faculty({
            ...req.body,
            email: req.body.email?.toLowerCase().trim(),
            tenantId: req.body.tenantId?.toLowerCase().trim()
        });
        await newStaff.save();
        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllFaculty, updateFacultySubject, updateFacultyStatus, deleteFaculty, loginStaff, registerStaff };