// Author: Himanshu Tripathi
// Department: AI and DS

const Fleet = require('../models/Fleet'); // 🔥 CAPITAL 'F' FIX FOR RENDER LINUX

// 1. Get all buses for a specific tenant (Reception/Admin ke Dashboard ke liye)
const getAllFleets = async (req, res) => {
    try {
        // req.tenantMapping middleware se aayega, nahi toh params ya query se lega
        let activeTenant = req.tenantMapping || req.params.tenantId || req.query.tenantId || 'test-01';
        
        // 🔥 CRITICAL FIX: TenantId ko humesha small letter mein search karo
        activeTenant = activeTenant.toLowerCase().trim();

        const fleets = await Fleet.find({ tenantId: activeTenant });
        res.status(200).json({ success: true, data: fleets });
    } catch (error) {
        console.error("❌ Fetch Fleets Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Add or Update Bus Live Location (Driver Dashboard se Live Hit Hoga)
const updateBusLocation = async (req, res) => {
    try {
        // 🔥 Ye fields DriverDashboard ke API payload se match karti hain
        const { 
            busNo, currentStop, status, velocity, passengers, 
            tenantId, route, driver, driverContact, maxCapacity 
        } = req.body;
        
        let activeTenant = req.user?.tenantId || tenantId || 'test-01';
        activeTenant = activeTenant.toLowerCase().trim();

        if (!busNo) {
            return res.status(400).json({ success: false, message: "Validation Failed: Bus Number is mandatory." });
        }

        // Find existing bus by busNo and tenantId, and UPDATE live telemetry
        const updatedFleet = await Fleet.findOneAndUpdate(
            { busNo: busNo, tenantId: activeTenant },
            { 
                currentStop: currentStop,
                status: status,
                velocity: velocity,
                passengers: passengers,
                // Agar nayi bus upsert ho rahi hai, tabhi ye naye fields add honge
                ...(route && { route }),
                ...(driver && { driver }),
                ...(driverContact && { driverContact }),
                ...(maxCapacity && { maxCapacity })
            },
            { new: true, upsert: true } // Upsert means: create if not exists
        );

        res.status(200).json({ success: true, message: "Fleet telemetry synchronized", data: updatedFleet });
    } catch (error) {
        console.error("❌ Update Location Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete a bus record
const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Fleet.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Fleet record not found" });
        }
        
        res.status(200).json({ success: true, message: "Fleet record removed successfully" });
    } catch (error) {
        console.error("❌ Delete Fleet Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllFleets, // ✨ FIXED EXPORT NAME
    updateBusLocation,
    deleteBus
};