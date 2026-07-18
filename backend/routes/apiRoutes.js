// Author: Himanshu Tripathi
// Department: AI and DS

const express = require('express');
const router = express.Router();

// =========================================================================
// 🎛️ CORE CONTROLLER IMPORTS
// =========================================================================
const studentController = require('../controllers/studentController');
const fleetController = require('../controllers/fleetController');
const facultyController = require('../controllers/facultyController');
const authController = require('../controllers/authController');
const superAdminController = require('../controllers/superAdminController');

const Student = require('../models/Student');
const Faculty = require('../models/Faculty'); 

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { verifyTenantAccess } = require('../middleware/tenantGuard');

// =========================================================================
// 🔑 CORE AUTHENTICATION GATEWAY ENDPOINTS
// =========================================================================
router.post('/auth/login', authController.executeGatewayLogin);

// =========================================================================
// 🛡️ GLOBAL SUPER ADMIN ENTERPRISE OPERATIONS PIPELINES
// =========================================================================
router.get('/superadmin/dashboard-metrics', superAdminController.getSuperAdminMetrics);
router.post('/superadmin/provision-tenant', superAdminController.provisionTenant);
router.delete('/superadmin/decommission/:id', protect, authorizeRoles('super-admin'), superAdminController.decommissionTenant);
router.get('/superadmin/global-search', protect, authorizeRoles('super-admin'), superAdminController.globalCrossNodeSearch);
router.post('/superadmin/node-backup', protect, authorizeRoles('super-admin'), superAdminController.triggerNodeBackup);
router.post('/superadmin/broadcast-alert', protect, authorizeRoles('super-admin'), superAdminController.broadcastGlobalAlert);

// =========================================================================
// 🔄 SECURE LOCAL FAILOVER MESH LAYER ENDPOINT
// =========================================================================
router.get('/backup/snapshot', protect, verifyTenantAccess, async (req, res) => {
  try {
    // 🔥 FIXED: tenantMapping ki jagah tenantId
    const isolatedData = await Student.find({ tenantId: req.tenantMapping });
    res.json({
      success: true,
      source: "EduCore SaaS Secure Failover Mesh Layer",
      node: req.tenantMapping,
      timestamp: new Date().toISOString(),
      snapshot: isolatedData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Mesh isolation pipeline failed", error: error.message });
  }
});

// =========================================================================
// 🚀 ENTERPRISE ERP PIPELINES
// =========================================================================
router.get('/students', protect, verifyTenantAccess, studentController.getAllStudents);
router.put('/students/attendance', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'teacher'), studentController.updateAttendance);
router.put('/students/performance-override', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'teacher'), studentController.updateStudentPerformance);

router.post('/admin/register-student', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin'), async (req, res) => {
  try {
    const { name, rollNumber, branch, parentName, parentEmail, totalFee, classAllocation, previousInstitute, sectionAllocation } = req.body;
    const activeTenant = req.user.role === 'super-admin' ? (req.body.tenantId || "CLUSTER-AI-DS") : req.tenantMapping;

    const newStudent = new Student({ 
      name, rollNumber, branch, parentName, 
      parentEmail: parentEmail?.toLowerCase().trim(), 
      totalFee: Number(totalFee) || 145000,
      classAllocation: classAllocation || "B.Tech 1st Year",
      academicHistory: { admissionSession: "2026-2027", previousInstitute: previousInstitute || "N/A" },
      sectionAllocation: sectionAllocation || "A",
      tenantId: activeTenant // 🔥 FIXED
    });
    
    await newStudent.save();
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/parent/my-child/:email', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'parent'), async (req, res) => {
  try {
    const parentEmail = req.params.email.toLowerCase().trim();
    if (req.user.role === 'parent' && req.user.email !== parentEmail) {
      return res.status(403).json({ success: false, message: "Security Violation: Access Denied." });
    }
    const query = { parentEmail: parentEmail };
    if (req.user.role !== 'super-admin') {
      query.tenantId = req.tenantMapping; // 🔥 FIXED
    }
    const childRecord = await Student.findOne(query);
    if (!childRecord) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }
    res.json({ success: true, data: childRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/parent/submit-payment', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'parent'), async (req, res) => {
  try {
    const { parentEmail, paymentAmount } = req.body;
    const cleanEmail = parentEmail?.toLowerCase().trim();
    const deductValue = Number(paymentAmount);

    if (!cleanEmail || !deductValue || deductValue <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input: Email and valid amount required" });
    }
    if (req.user.role === 'parent' && req.user.email !== cleanEmail) {
      return res.status(403).json({ success: false, message: "Security Violation: Unauthorized access attempt." });
    }

    const query = { parentEmail: cleanEmail };
    if (req.user.role !== 'super-admin') query.tenantId = req.tenantMapping; // 🔥 FIXED

    const student = await Student.findOne(query);
    if (!student) return res.status(404).json({ success: false, message: "Target student context not detected" });

    const nextOutstandingBalance = Math.max(0, (student.totalFee || 0) - deductValue);
    student.totalFee = nextOutstandingBalance;
    student.paidFee = (student.paidFee || 0) + deductValue;
    student.feeStatus = nextOutstandingBalance === 0 ? "Paid" : "Partially-Paid";

    await student.save();
    res.status(200).json({ success: true, message: `Transaction processed.`, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================================================
// 📍 IoT LOGISTICS TRANSIT FLEET ENDPOINTS
// =========================================================================
router.get('/fleets', protect, verifyTenantAccess, fleetController.getAllFleets);

// 🔥 UPDATED: Added 'driver' role so they can push live telemetry!
router.put('/fleets/location', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'transport-manager', 'driver'), fleetController.updateBusLocation);

// 🔥 NEW: Added Delete Fleet Endpoint
router.delete('/fleets/:id', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin'), fleetController.deleteBus);

// =========================================================================
// 🎓 STAFF & DIRECTOR MANAGEMENT ENDPOINTS
// =========================================================================
router.get('/admin/faculties', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'director'), facultyController.getAllFaculty);
router.delete('/admin/staff/:id', protect, authorizeRoles('super-admin', 'admin', 'director'), facultyController.deleteFaculty);
router.put('/admin/staff/:id/status', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'director'), facultyController.updateFacultyStatus);
router.post('/admin/register-staff', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin', 'director'), authController.registerStaff);
router.post('/admin/register-director', protect, verifyTenantAccess, authorizeRoles('super-admin', 'admin'), authController.registerDirector);

router.delete('/admin/faculty/:id', protect, authorizeRoles('super-admin', 'admin', 'director'), async (req, res) => {
    try {
        const deletedStaff = await Faculty.findByIdAndDelete(req.params.id);
        if (!deletedStaff) return res.status(404).json({ success: false, message: "Staff not found!" });
        res.status(200).json({ success: true, message: "Staff terminated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting staff." });
    }
});

// =========================================================================
// 🏫 PRINCIPAL DASHBOARD PIPELINES
// =========================================================================
router.get('/principal/students', protect, verifyTenantAccess, authorizeRoles('principal', 'super-admin', 'admin'), async (req, res) => {
  try {
    // 🔥 FIXED: tenantMapping ki jagah tenantId
    const students = await Student.find({ tenantId: req.tenantMapping });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/principal/teachers', protect, verifyTenantAccess, authorizeRoles('principal', 'super-admin', 'admin'), async (req, res) => {
  try {
    // 🔥 FIXED: tenantMapping ki jagah tenantId
    const teachers = await Faculty.find({ tenantId: req.tenantMapping });
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================================
// 🚀 NEW ERP SYNC PIPELINES (ACCOUNTANT, RECEPTIONIST)
// =========================================================================

// Receptionist: New Admission Pipeline
router.post('/receptionist/new-admission', protect, verifyTenantAccess, authorizeRoles('receptionist', 'super-admin', 'admin'), async (req, res) => {
  try {
    const newStudent = new Student({ 
      ...req.body, 
      tenantId: req.tenantMapping // 🔥 FIXED: Database mein tenantId ke naam se save hoga
    });
    
    await newStudent.save();
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, details: error.errors });
  }
});

// Accountant: Fee Update Pipeline
router.put('/accountant/fees/update/:id', protect, verifyTenantAccess, authorizeRoles('accountant', 'super-admin', 'admin'), async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.tenantMapping }, // 🔥 FIXED
        { $set: { paidFee: req.body.amount, feeStatus: 'Paid' } }, 
        { new: true }
    );
    if (!student) return res.status(404).json({ success: false, message: "Student record not found." });
    res.status(200).json({ success: true, data: student, message: "Fees updated and synced globally." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================================
// 🗓️ GLOBAL HOLIDAY CALENDAR PIPELINE (NEW)
// =========================================================================
router.get('/holidays', protect, (req, res) => {
  try {
    // Abhi ke liye hum data yahin define kar rahe hain. 
    // Future mein tum ise MongoDB ke "Holiday" model se fetch kar sakte ho.
    const holidaysData = [
      { id: 1, date: '15 Aug 2026', name: 'Independence Day', type: 'Government Holiday' },
      { id: 2, date: '02 Oct 2026', name: 'Gandhi Jayanti', type: 'Government Holiday' },
      { id: 3, date: '08 Nov 2026', name: 'Diwali', type: 'Festival' },
      { id: 4, date: '25 Dec 2026', name: 'Christmas', type: 'Festival' },
      { id: 5, date: '26 Jan 2027', name: 'Republic Day', type: 'Government Holiday' },
      { id: 6, date: '22 Mar 2027', name: 'Holi', type: 'Festival' }
    ];
    
    res.status(200).json({ 
      success: true, 
      message: "Academic Calendar synchronized.", 
      data: holidaysData 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load calendar", error: error.message });
  }
});

module.exports = router;