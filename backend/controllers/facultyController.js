const Faculty = require('../models/Faculty'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

// 1. Get All Faculty - 🔥 FIXED: CASE-INSENSITIVE TENANT SEARCH
const getAllFaculty = async (req, res) => {
    try {
        // Regex 'i' ignores uppercase/lowercase differences
        const faculties = await Faculty.find({ 
            tenantId: { $regex: new RegExp(`^${req.tenantMapping}$`, 'i') } 
        }).select('-password'); 
        res.status(200).json({ success: true, data: faculties });
    } catch (error) {
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

// 3. Status Control (Director/Principal only)
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
            return res.status(400).json({ success: false, message: "Invalid status provided. Must be Active, Blocked, or Terminated." });
        }

        const faculty = await Faculty.findByIdAndUpdate(id, { status: formattedStatus }, { new: true }).select('-password');
        
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty member not found." });
        }
        
        res.status(200).json({ success: true, message: `Status updated to ${formattedStatus}`, data: faculty });
    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Permanent Delete (Strictly by Admin/Director)
const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Delete karne ki koshish kar raha hoon ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Error: Invalid MongoDB ID format.");
            return res.status(400).json({ success: false, message: "Invalid ID format sent from frontend." });
        }

        const deleted = await Faculty.findByIdAndDelete(id);
        
        if (!deleted) {
            console.log("Error: Record ID nahi mila DB me:", id);
            return res.status(404).json({ success: false, message: "Record nahi mila database me." });
        }

        res.status(200).json({ success: true, message: "Faculty delete ho gaya!" });
    } catch (error) {
        console.error("Backend Delete Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Staff Login 
const loginStaff = async (req, res) => {
    try {
        const { email, password, tenantId } = req.body;

        console.log(`[LOGIN INITIATED] Tenant: '${tenantId}', Email: '${email}'`);

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

        // Normal Staff Database Check
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

        res.status(200).json({ 
            success: true, 
            token, 
            user: { name: user.name, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Register Staff (Permanent Data Save)
const registerStaff = async (req, res) => {
    try {
        console.log("🔥 SAVING STAFF TO DB:", req.body);
        
        const newStaff = new Faculty({
            ...req.body,
            email: req.body.email?.toLowerCase().trim(),
            tenantId: req.body.tenantId?.toLowerCase().trim()
        });

        await newStaff.save();
        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllFaculty, updateFacultySubject, updateFacultyStatus, deleteFaculty, loginStaff, registerStaff };