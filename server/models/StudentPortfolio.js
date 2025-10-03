const mongoose = require('mongoose');

const StudentPortfolioSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  placementEmail: String,
  Portfolio: String,
  Resume: String,
  LinkedIn: String,
  GitHub: String,
  HackerRank: String,
  LeetCode: String,
  HackerEarth: String,
  Skillrack: String,
  GeeksforGeeks: String,
  domains: [String],
  projects: [{ link: String, description: String }]
});

module.exports = mongoose.model('StudentPortfolio', StudentPortfolioSchema, 'StudentPortfolios'); 