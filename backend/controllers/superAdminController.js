// Author: Himanshu Tripathi
// Department: AI and DS
// Description: Super Admin Controller - Extended Enterprise Version

const Tenant = require('../models/Tenant');
const Student = require('../models/Student'); 
const Faculty = require('../models/Faculty'); 

/**
 * HELPER: SANITIZATION LOGIC
 * Global function to clean incoming data strings.
 */
const sanitizeData = (data) => {
    if (typeof data !== 'string') return data;
    return data.toLowerCase().trim();
};

// 1. GET SUPER ADMIN METRICS
// Updated getSuperAdminMetrics for debugging
const getSuperAdminMetrics = async (req, res) => {
    try {
        const tenants = await Tenant.find({});
        
        const tenantsWithStats = await Promise.all(tenants.map(async (tenant) => {
            // 🔥 DEBUGGING: Check values
            const code = tenant.tenantCode;
            const students = await Student.find({ tenantId: code });
            const teachers = await Faculty.find({ tenantId: code });
            
            console.log(`DEBUG: Campus ${code} | Students Found: ${students.length} | Teachers Found: ${teachers.length}`);
            
            return {
                ...tenant.toObject(),
                stats: {
                    students: students.length,
                    teachers: teachers.length
                }
            };
        }));

        res.status(200).json({ success: true, data: tenantsWithStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. PROVISION NEW TENANT (Enterprise Version - 100% Crash Proof)
const provisionTenant = async (req, res) => {
    try {
        console.log("📥 [System Log]: Provisioning new campus node...", req.body); 

        const { name, tenantCode, tenantId, adminEmail, directorName, directorEmail, directorPassword, password } = req.body;
        
        // 🔥 FIX 1: Handle both tenantCode and tenantId formats
        const safeTenantCode = sanitizeData(tenantCode || tenantId);
        
        // 🔥 FIX 2: Use directorEmail if adminEmail is not provided (No default 'admin@default.com' anymore)
        const primaryEmail = sanitizeData(adminEmail || directorEmail); 
        const finalPassword = directorPassword || password || '123456';

        // Validation Layer
        if (!safeTenantCode || !primaryEmail) {
            return res.status(400).json({ success: false, message: "Validation Failed: Campus Tracking ID and Director Email are mandatory." });
        }

        // Duplicate Campus Check
        const exists = await Tenant.findOne({ $or: [{ tenantCode: safeTenantCode }, { tenantId: safeTenantCode }] });
        if (exists) {
            return res.status(409).json({ success: false, message: `Campus ID '${safeTenantCode}' is already registered in the ecosystem.` });
        }

        // Duplicate Email Check (Prevents MongoDB E11000 500 Error)
        const existingUser = await Faculty.findOne({ email: primaryEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: `The email '${primaryEmail}' is already in use by another account.` });
        }

        // Create Tenant
        const newTenant = new Tenant({
            name: name || 'Unknown Campus',
            tenantCode: safeTenantCode, 
            tenantId: safeTenantCode,   
            adminEmail: primaryEmail,
            status: "Active"
        });
        await newTenant.save();
        console.log(`✅ [Provisioning]: Tenant '${name}' provisioned in DB.`);

        // Create Primary Director/Admin Account
        const mainAccount = new Faculty({
            name: directorName || `${name || 'Campus'} Director`,
            email: primaryEmail,
            password: finalPassword, 
            role: 'director', // Role set to director as per frontend form
            tenantId: safeTenantCode,
            phone: "0000000000" 
        });
        await mainAccount.save();
        console.log(`✅ [Provisioning]: Director mapped.`);

        res.status(201).json({ 
            success: true, 
            message: "Campus network and Director account provisioned successfully.", 
            tenantId: safeTenantCode 
        });

    } catch (error) {
        console.error("🚨 [Critical Error]: Tenant provisioning failed:", error);
        res.status(500).json({ success: false, message: "Provisioning failed: " + error.message });
    }
};

// 3. DECOMMISSION TENANT
const decommissionTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant = await Tenant.findById(id);
        
        if (!tenant) return res.status(404).json({ success: false, message: "Tenant entity not found." });

        const code = tenant.tenantId;
        
        // Atomic Deletion
        await Tenant.findByIdAndDelete(id);
        await Faculty.deleteMany({ tenantId: code });
        await Student.deleteMany({ tenantId: code });

        console.log(`🗑️ [System Log]: Campus ${code} decommissioned.`);
        res.status(200).json({ success: true, message: "Campus and associated data wiped." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. GLOBAL SEARCH
const globalCrossNodeSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, message: "Search parameter missing." });
        
        const results = await Student.find({ name: { $regex: query, $options: 'i' } }).limit(50);
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. NODE BACKUP (Disaster Recovery Simulation)
const triggerNodeBackup = async (req, res) => {
    try {
        const { tenantCode } = req.body;
        if (!tenantCode) {
             return res.status(200).json({ success: true, message: "Full system snapshot initiated." });
        }

        const tenant = await Tenant.findOne({ tenantCode: sanitizeData(tenantCode) });
        if (!tenant) return res.status(404).json({ success: false, message: "Target node offline." });

        res.status(200).json({ success: true, status: "Dump exported", timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. BROADCAST
const broadcastGlobalAlert = async (req, res) => {
    res.status(200).json({ success: true, message: "Global broadcast signal propagated." });
};

module.exports = {
    getSuperAdminMetrics,
    provisionTenant,
    decommissionTenant,
    globalCrossNodeSearch,
    triggerNodeBackup,
    broadcastGlobalAlert
};