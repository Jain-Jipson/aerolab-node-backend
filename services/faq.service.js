const Faq = require('../models/faq.model');
const axios = require('axios');

// ✅ Get All FAQs
async function getAllFaqs() {
  return await Faq.find();
}

// ✅ Add a new FAQ
async function addFaq(faq) {
  return await Faq.create(faq);
}

// ✅ Search FAQ by question → Predefined or OpenAI fallback
async function getAnswerByQuestion(query) {
  try {
    const exactMatch = await Faq.findOne({ question: query });
    if (exactMatch) return { ...exactMatch.toObject(), source: 'Predefined' };

    // Fallback to OpenAI
    const aiFaq = await getOpenAIResponse(query);
    return { ...aiFaq, source: 'AI' };
  } catch (error) {
    console.error('❌ Error in getAnswerByQuestion:', error.message);
    return { question: query, answer: 'An error occurred.', category: 'Error' };
  }
}

// ✅ Query OpenAI API
async function getOpenAIResponse(query) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI receptionist. Answer user queries based on your training.' },
          { role: 'user', content: query }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    return {
      question: query,
      answer: answer || "I don't know the answer yet!",
      category: 'AI Generated'
    };
  } catch (err) {
    console.error('❌ OpenAI error:', err.message);
    return {
      question: query,
      answer: "I couldn't fetch a response from OpenAI.",
      category: 'AI Error'
    };
  }
}

module.exports = {
  getAllFaqs,
  addFaq,
  getAnswerByQuestion
};
