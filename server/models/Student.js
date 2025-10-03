const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  Roll: String,
  Register: String,
  Name: String,
  "E-mail": String,
  "Student Mobile No": String,
  "Parents Mobile No ": String,
  Department: String,
  "Batch ": String,
  "Section ": String,
  Mentor: String,
  Portfolio: String,
  Resume: String,
  LinkedIn: String,
  GitHub: String,
  HackerRank: String,
  LeetCode: String,
  "Semester Results": mongoose.Schema.Types.Mixed,
  Status: String,
  HackerEarth: String,
  Skillrack: String,
  GeeksforGeeks: String,
  domains: [String],
  projects: [String]
  // Add any other fields you use in your collection
});

module.exports = mongoose.model('Student', StudentSchema, 'Students');