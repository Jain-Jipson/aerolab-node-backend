const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    checkInTime: Date,
    checkOutTime: Date
});

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema);
