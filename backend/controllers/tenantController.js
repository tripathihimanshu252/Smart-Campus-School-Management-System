const Tenant = require('../models/Tenant');
const mongoose = require('mongoose');

// 1. Provision New Tenant (Add School)
const provisionTenant = async (req, res) => {
    try {
        const { name, tenantCode, adminEmail, directorName, directorEmail, directorPassword } = req.body;
        
        // Check if tenant already exists
        const exists = await Tenant.findOne({ tenantCode });
        if (exists) {
            return res.status(400).json({ success: false, message: "Tenant code already registered." });
        }

        const newTenant = new Tenant({
            name,
            tenantCode,
            adminEmail,
            directorDetails: {
                name: directorName,
                email: directorEmail,
                password: directorPassword
            },
            status: "Active"
        });

        await newTenant.save();
        res.status(201).json({ success: true, message: "Tenant provisioned successfully", data: newTenant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Tenants (Dashboard Metrics)
const getDashboardMetrics = async (req, res) => {
    try {
        const tenants = await Tenant.find({});
        res.status(200).json({ success: true, data: tenants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Decommission Tenant (Delete School Network)
const decommissionTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Tenant.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Tenant not found." });
        }
        
        res.status(200).json({ success: true, message: "Campus network decommissioned successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Generate Node Backup
const nodeBackup = async (req, res) => {
    try {
        const { tenantCode } = req.body;
        const tenant = await Tenant.findOne({ tenantCode });
        
        if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found." });

        // Backup logic: Yahan tum extra data fetch karke dump generate kar sakte ho
        const dump = {
            system: 'EduCore SaaS Cloud Infrastructure',
            schoolCode: tenantCode,
            backupTimestamp: new Date().toISOString(),
            tenantData: tenant
        };

        res.status(200).json({ success: true, dump });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    provisionTenant,
    getDashboardMetrics,
    decommissionTenant,
    nodeBackup
};