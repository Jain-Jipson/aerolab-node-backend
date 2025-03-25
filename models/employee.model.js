const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  rfid: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Add a virtual 'id' field that maps to '_id'
employeeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// ✅ Enable virtuals in JSON output
employeeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Employee', employeeSchema);
