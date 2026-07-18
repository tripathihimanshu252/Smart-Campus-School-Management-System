// Author: Himanshu Tripathi
// Department: AI and DS

const mongoose = require('mongoose');

const FleetSchema = new mongoose.Schema({
  // =========================================================================
  // ✅ CORE FLEET DETAILS
  // =========================================================================
  tenantId: { 
    type: String, 
    required: true,
    default: 'gniot-ai-ds', // 🔥 Lowercase default to prevent case-mismatch errors
    lowercase: true,        // 🔥 Enforces lowercase strictness (Solves old login issues)
    trim: true,
    index: true             // Fast lookup optimization across multiple school clusters
  },
  busNo: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  route: { 
    type: String, 
    required: true,
    trim: true 
  },
  driver: { 
    type: String, 
    required: true,
    trim: true 
  },
  driverContact: {
    type: String,
    default: "9999999999",
    trim: true
  },
  maxCapacity: {
    type: Number,
    default: 50
  },

  // =========================================================================
  // ⚡ LIVE TELEMETRY & TRACKING (Syncs with Driver Dashboard API)
  // =========================================================================
  currentStop: { 
    type: String, 
    default: 'Bus Depot / Yard',
    trim: true 
  },
  status: {  // 🔥 Changed from 'telemetryStatus' to match React frontend payload
    type: String, 
    enum: ['In-Transit', 'Off-Duty'],
    default: 'Off-Duty',
    trim: true 
  },
  velocity: { // 🔥 Added to capture the speed from your React dashboard
    type: Number, 
    default: 0 
  },
  passengers: { // 🔥 Changed from 'allocatedStudentsCount' to match React payload
    type: Number, 
    default: 0 
  },
  gpsCoordinates: {
    latitude: { type: Number, default: 28.4744 },  // Default Knowledge Park context seeds
    longitude: { type: Number, default: 77.4905 }
  },
  isActive: {
    type: Boolean,
    default: true // Fleet activation/maintenance state switcher
  }
}, { 
  timestamps: true // Auto adds 'createdAt' and 'updatedAt' tracking fields to MongoDB cluster records
});

module.exports = mongoose.model('Fleet', FleetSchema);