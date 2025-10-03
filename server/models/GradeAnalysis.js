const mongoose = require('mongoose');

const gradeAnalysisSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  sectionId: { type: String, required: true },
  departmentId: { type: String, required: true },
  semester: { type: String, required: true },
  classIncharge: {
    name: { type: String, required: true },
    staffId: { type: String, required: true }
  },
  subjectAnalysis: [{
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    grades: {
      O: { type: Number, default: 0 },
      'A+': { type: Number, default: 0 },
      A: { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      U: { type: Number, default: 0 },
      RA: { type: Number, default: 0 },
      SA: { type: Number, default: 0 },
      W: { type: Number, default: 0 }
    }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

// Compound index to ensure unique analysis per batch, section, department and semester
gradeAnalysisSchema.index({ batchId: 1, sectionId: 1, departmentId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('GradeAnalysis', gradeAnalysisSchema, 'gradeanalysis'); // Explicitly set collection name