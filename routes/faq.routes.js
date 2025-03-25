const express = require('express');
const router = express.Router();
const faqService = require('../services/faq.service');
const Faq = require('../models/faq.model');

// ✅ GET all FAQs
router.get('/', async (req, res) => {
  try {
    console.log("🔍 Attempting to fetch FAQs from MongoDB...");
    const faqs = await Faq.find();
    console.log("✅ Fetched FAQs:", faqs.length);
    res.json(faqs);
  } catch (err) {
    console.error("❌ FAQ Fetch Error:", err);
    res.status(500).json({ message: "Server error fetching FAQs." });
  }
});

// ✅ POST new FAQ
router.post('/', async (req, res) => {
  const { question, answer, category } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and Answer are required." });
  }

  try {
    const faq = await faqService.addFaq({ question, answer, category });
    res.status(201).json(faq);
  } catch (err) {
    console.error("❌ Error saving FAQ:", err.message);
    res.status(500).json({ message: "Failed to save FAQ." });
  }
});

// ✅ GET: /api/faqs/search?query=your-question (normalized match)
router.get('/search', async (req, res) => {
  const query = req.query.query;

  if (!query) return res.status(400).json({ message: "Query parameter is required." });

  try {
    const normalized = query.trim().toLowerCase();
    const faqs = await Faq.find();
    const match = faqs.find(f => f.question.trim().toLowerCase() === normalized);

    if (match) return res.json({ ...match.toObject(), source: 'Predefined' });

    const fallback = await faqService.getAnswerByQuestion(query);
    res.json(fallback);
  } catch (err) {
    console.error("❌ Error in search:", err.message);
    res.status(500).json({ message: "Search failed." });
  }
});

// ✅ POST: /api/faqs/voice
router.post('/voice', async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Invalid voice input." });

  try {
    const normalized = query.trim().toLowerCase();
    const faqs = await Faq.find();
    const match = faqs.find(f => f.question.trim().toLowerCase() === normalized);

    if (match) return res.json({ ...match.toObject(), source: 'Predefined' });

    const fallback = await faqService.getAnswerByQuestion(query);
    res.json(fallback);
  } catch (err) {
    console.error("❌ Voice processing error:", err.message);
    res.status(500).json({ message: "Failed to process voice query." });
  }
});

module.exports = router;
