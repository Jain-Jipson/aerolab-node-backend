const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');
const axios = require('axios');

// GET /api/employees
router.get('/', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

// POST /api/employees
router.post('/', async (req, res) => {
    console.log("🟡 Incoming POST /api/employees", req.body); // Add this for visibility
  
    try {
      const newEmp = new Employee(req.body);
      await newEmp.save();
      res.status(201).json(newEmp);
    } catch (err) {
      console.error("❌ Error adding employee:", err.message);
      res.status(500).json({ error: 'Failed to add employee' });
    }
  });

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log("🗑️ Delete Request for ID:", id);

    try {
        const result = await Employee.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(204).send(); // No content
    } catch (err) {
        console.error("❌ Error deleting employee:", err.message);
        res.status(500).json({ error: "Failed to delete employee" });
    }
});

// POST /api/employees/move-motor
router.post('/move-motor', async (req, res) => {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'Invalid Employee ID' });

    try {
        const response = await axios.post('http://192.168.1.6/move-servo', req.body);
        if (response.status === 200) {
            return res.json({ message: 'Servo moved successfully!' });
        }
        return res.status(400).json({ message: 'Failed to move servo.' });
    } catch (err) {
        return res.status(500).json({ message: 'Motor request failed.', error: err.message });
    }
});

module.exports = router;
