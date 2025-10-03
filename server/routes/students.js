const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust path as needed
const StudentPortfolio = require('../models/StudentPortfolio');

// Get all students for a class incharge (by batch and section)
router.get('/classincharge', async (req, res) => {
  const { batchId, sectionId } = req.query;
  console.log('Fetching students with query:', { batchId, sectionId });
  try {
    const students = await Student.find({
      "Batch ": batchId,
      "Section ": sectionId
    });
    console.log(`Found ${students.length} students`);
    if (students.length === 0) {
      console.log('No students found. Checking database for sample document...');
      const sampleStudent = await Student.findOne({});
      if (sampleStudent) {
        console.log('Sample student document:', {
          batch: sampleStudent["Batch "],
          section: sampleStudent["Section "]
        });
      } else {
        console.log('No students in database at all');
      }
    }
    res.json({ success: true, students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mentor-wise analysis for a class incharge (by batch and section)
router.get('/mentorwise', async (req, res) => {
  const { batchId, sectionId } = req.query;
  try {
    const students = await Student.find({
      "Batch ": batchId,
      "Section ": sectionId
    });
    // Group by Mentor
    const mentorMap = {};
    students.forEach(student => {
      const mentorId = student.Mentor;
      if (!mentorMap[mentorId]) mentorMap[mentorId] = [];
      mentorMap[mentorId].push(student);
    });
    // Format result
    const result = Object.entries(mentorMap).map(([mentorId, students]) => ({
      mentorId,
      students,
      totalStudents: students.length
    }));
    res.json({ success: true, mentors: result });
  } catch (err) {
    console.error('Error fetching mentor analysis:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single student details by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    // Fetch portfolio
    const portfolio = await StudentPortfolio.findOne({ studentId: student._id });
    console.log('[Portfolio GET] studentId:', student._id, 'portfolio:', portfolio);
    res.json({ success: true, student, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update student portfolio/profile
router.put('/:id/portfolio', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    // Upsert portfolio
    const updateFields = req.body;
    const portfolio = await StudentPortfolio.findOneAndUpdate(
      { studentId: student._id },
      { $set: { ...updateFields, studentId: student._id } },
      { new: true, upsert: true }
    );
    console.log('[Portfolio PUT] studentId:', student._id, 'updated portfolio:', portfolio);
    res.json({ success: true, portfolio });
  } catch (err) {
    console.error('Error updating student portfolio:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;