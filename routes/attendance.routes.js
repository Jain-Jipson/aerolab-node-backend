const express = require('express');
const router = express.Router();
const AttendanceLog = require('../models/attendance.model');
const Employee = require('../models/employee.model');

// GET all logs
router.get('/', async (req, res) => {
    const logs = await AttendanceLog.find();
    res.json(logs);
});

// GET specific log
router.get('/:id', async (req, res) => {
    const log = await AttendanceLog.findById(req.params.id);
    if (!log) return res.status(404).send();
    res.json(log);
});

// POST new log (manual entry)
router.post('/', async (req, res) => {
    const newLog = new AttendanceLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
});

// PUT log update
router.put('/:id', async (req, res) => {
    await AttendanceLog.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(204);
});

// DELETE a log
router.delete('/:id', async (req, res) => {
    await AttendanceLog.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// RFID Attendance Logging
router.post('/log', async (req, res) => {
    const { rfid } = req.body;
    if (!rfid) return res.status(400).json({ message: 'RFID required' });

    const employee = await Employee.findOne({ rfid });
    if (!employee) return res.status(404).json({ message: 'RFID not registered' });

    const lastLog = await AttendanceLog.findOne({ employeeId: employee._id }).sort({ checkInTime: -1 });

    if (!lastLog || lastLog.checkOutTime) {
        const newLog = new AttendanceLog({
            employeeId: employee._id,
            checkInTime: new Date()
        });
        await newLog.save();
    } else {
        lastLog.checkOutTime = new Date();
        await lastLog.save();
    }

    res.json({ message: 'Attendance logged', EmployeeId: employee._id });
});

module.exports = router;
