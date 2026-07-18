const Student = require('../models/Student'); 

// 1. Get All Students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ tenantMapping: req.tenantMapping });
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Update Attendance
const updateAttendance = async (req, res) => {
    try {
        const { rollNumber, attendance } = req.body;
        const student = await Student.findOneAndUpdate(
            { rollNumber, tenantMapping: req.tenantMapping },
            { attendance },
            { new: true }
        );
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Update Performance
const updateStudentPerformance = async (req, res) => {
    try {
        const { rollNumber, performanceData } = req.body;
        const student = await Student.findOneAndUpdate(
            { rollNumber, tenantMapping: req.tenantMapping },
            { performance: performanceData },
            { new: true }
        );
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Register Student
const registerStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllStudents,
    updateAttendance,
    updateStudentPerformance,
    registerStudent
};