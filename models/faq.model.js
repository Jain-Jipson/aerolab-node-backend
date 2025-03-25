const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: "" }
}, {
  collection: 'FAQs' // 👈👈 THIS IS CRUCIAL
});

module.exports = mongoose.model('Faq', faqSchema);
