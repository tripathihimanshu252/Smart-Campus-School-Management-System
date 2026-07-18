// Author: Himanshu Tripathi
// Department: AI and DS

const Faculty = require('../models/faculty'); 
const jwt = require('jsonwebtoken');

// 1. GATEWAY LOGIN (Updated for Role-Based Isolation)
const executeGatewayLogin = async (req, res) => {
    try {
        console.log("📥 LOGIN REQUEST RECEIVED:", req.body);

        const tenantId = req.body.tenantId?.toLowerCase().trim();
        const email = req.body.email?.toLowerCase().trim();
        const password = req.body.password;
        
        const requestedRole = req.body.role?.toLowerCase().trim(); 

        // Super Admin Bypass
        if (tenantId === 'super' && email === 'super@gmail.com' && password === '123456') {
            console.log("✅ Super Admin Login Successful");
            const token = jwt.sign(
                { id: 'super-admin-101', email: email, role: 'super-admin', tenantId: tenantId },
                process.env.JWT_SECRET || 'SESSION_JWT_NODE_VECTOR_TEST_CLUSTER-AI-DS',
                { expiresIn: '24h' }
            );
            return res.status(200).json({ 
                success: true, 
                token: token, 
                user: { name: "Himanshu Tripathi", role: "super-admin", email: email, schoolId: tenantId } 
            });
        }

        // NORMAL LOGIN LOGIC
        const user = await Faculty.findOne({ email: email, tenantId: tenantId });
        
        if (!user) {
            console.log("❌ User not found:", email, tenantId);
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // 🔥 SECURITY FIX: Support Staff ko login se block karo
        if (user.role === 'support_staff') {
            console.log("🚫 Access Denied: Support Staff cannot login via portal.");
            return res.status(403).json({ success: false, message: "This role does not have portal access." });
        }

        if (user.password !== password) {
            console.log("❌ Password mismatch for:", email);
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const dbRole = user.role.toLowerCase();
        
        if (requestedRole && dbRole !== requestedRole) {
           console.log("❌ Role Mismatch: DB has", dbRole, "but request has", requestedRole);
           return res.status(401).json({ success: false, message: "Unauthorized access for this role!" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: dbRole, tenantId: user.tenantId },
            process.env.JWT_SECRET || 'SESSION_JWT_NODE_VECTOR_TEST_CLUSTER-AI-DS',
            { expiresIn: '24h' }
        );

        console.log(`✅ Login Successful for: ${email} | Role: ${dbRole} | Tenant: ${user.tenantId}`);
        return res.status(200).json({ 
            success: true, 
            token: token, 
            user: { 
                name: user.name, 
                email: user.email, 
                role: dbRole, 
                schoolId: user.tenantId 
            }
        });
    } catch (error) {
        console.error("🚨 LOGIN CRASH:", error);
        return res.status(500).json({ success: false, message: "Internal server error during login." });
    }
};

// 2. DIRECTOR REGISTRATION (Restricted to one per Tenant)
const registerDirector = async (req, res) => {
    try {
        const { name, email, password, tenantId } = req.body;
        
        // 🔥 CRASH PREVENTION FIX: Ensure critical fields exist before calling string methods
        if (!email || !tenantId) {
            return res.status(400).json({ success: false, message: "Email and Tenant ID are required." });
        }

        const normalizedRole = 'director'; 
        const normalizedTenant = tenantId.toLowerCase().trim();

        const directorExists = await Faculty.findOne({ role: normalizedRole, tenantId: normalizedTenant });
        if (directorExists) {
            return res.status(400).json({ success: false, message: "A Director is already registered for this institution." });
        }

        const newDirector = new Faculty({ 
            name, 
            email: email.toLowerCase().trim(), 
            password, 
            role: normalizedRole, 
            tenantId: normalizedTenant 
        });
        
        await newDirector.save();
        
        return res.status(201).json({ success: true, message: "Director registered successfully", data: newDirector });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. STAFF REGISTRATION (Updated with Support Staff Logic)
// 3. STAFF REGISTRATION (Updated with Case-Sensitivity Fix)
const registerStaff = async (req, res) => { 
    try {
        console.log("🔥 SAVING STAFF TO DB, RECEIVED PAYLOAD:", req.body); 
        
        const activeTenant = req.user && req.user.role === 'super-admin' 
            ? (req.body.tenantId || "TEST-01") 
            : req.tenantMapping;

        // 🔥 FIX: Tenant ID ko lowercase mein force convert karo taaki login time match ho jaye
        const safeTenantId = activeTenant.toLowerCase().trim();
        const role = req.body.role ? req.body.role.toLowerCase().trim() : 'faculty';

        const staffData = {
            ...req.body,
            tenantId: safeTenantId, // <-- Capital ki jagah small save hoga
            role: role,
            experienceType: req.body.experienceType === 'Entry-Level' ? 'Entry Level' : req.body.experienceType,
            email: role === 'support_staff' ? undefined : req.body.email?.toLowerCase().trim(),
            password: role === 'support_staff' ? undefined : req.body.password
        };

        const newStaff = new Faculty(staffData);
        await newStaff.save();
        
        return res.status(201).json({ success: true, message: "Staff created successfully", data: newStaff });
    } catch (error) {
        console.error("❌ DB SAVE ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { executeGatewayLogin, registerDirector, registerStaff };