const mongoose = require('mongoose');

const semesterMarkSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  rollNo: { type: String, required: true },
  semesters: { type: mongoose.Schema.Types.Mixed, required: true }, // { '01': { marks, gpa }, ... }
  cgpa: { type: Number, required: true }
});

module.exports = mongoose.model('SemesterMark', semesterMarkSchema);
