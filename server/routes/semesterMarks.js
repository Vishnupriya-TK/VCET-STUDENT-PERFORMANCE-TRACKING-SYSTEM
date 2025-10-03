const express = require('express');
const router = express.Router();
const SemesterMark = require('../models/SemesterMark');
const GradeAnalysis = require('../models/GradeAnalysis');
const mongoose = require('mongoose');
const Student = require('../models/Student');

// Test-alive route to verify router is mounted
router.get('/test-alive', (req, res) => res.send('SemesterMarks router is alive!'));

// Save or update marks for a semester
router.post('/save', async (req, res) => {
  try {
    const operations = req.body.students.map(student => {
      const { regNo, rollNo, semesters } = student;
      
      // Calculate CGPA
      const gpas = Object.values(semesters)
        .map(sem => Number(sem.gpa))
        .filter(g => !isNaN(g) && g > 0);
      const cgpa = gpas.length ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : 0;

      // Create the update operation
      return {
        updateOne: {
          filter: { regNo },
          update: {
            $set: {
              semesters,
              rollNo,
              cgpa
            }
          },
          upsert: true
        }
      };
    });

    const result = await SemesterMark.bulkWrite(operations);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get marks for a semester
router.get('/', async (req, res) => {
  try {
    const students = await SemesterMark.find({});
    res.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save or update grade analysis
router.post('/analysis', async (req, res) => {
  try {
    const { batchId, sectionId, departmentId, semester, classIncharge, subjectAnalysis } = req.body;
    
    console.log('Received grade analysis data:', req.body);

    const filter = { batchId, sectionId, departmentId, semester };
    const update = {
      $set: {
        classIncharge,
        subjectAnalysis,
        lastUpdated: new Date()
      }
    };

    const result = await GradeAnalysis.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });

    console.log('Grade analysis saved:', result);
    res.json({ success: true, analysis: result });
  } catch (error) {
    console.error('Error saving grade analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get grade analysis
router.get('/analysis', async (req, res) => {
  try {
    const { batchId, sectionId, departmentId, semester } = req.query;
    
    console.log('Fetching grade analysis with params:', {
      batchId,
      sectionId,
      departmentId,
      semester
    });

    const analysis = await GradeAnalysis.findOne({
      batchId,
      sectionId,
      departmentId,
      semester
    });

    console.log('Found grade analysis:', analysis);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error fetching grade analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'SemesterMarks route is working!' });
});

// Accepts an object like { "01": 8.5, "02": 9.0, ... }
const calculateCGPA = (gpaBySemester) => {
  const gpas = Object.values(gpaBySemester).filter(g => !isNaN(g) && g > 0);
  if (gpas.length === 0) return 0;
  const sum = gpas.reduce((a, b) => a + b, 0);
  return (sum / gpas.length).toFixed(2);
};

const SemesterMarkSchema = new mongoose.Schema({
  regNo: String,
  rollNo: String,
  semesters: mongoose.Schema.Types.Mixed, // or Map
  cgpa: Number
});

router.get('/all', async (req, res) => {
  const students = await SemesterMark.find({});
  res.json({ success: true, students });
});

// Add this route to fetch a student's marks by their MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const student = await SemesterMark.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add this route to fetch a student's marks by their register number (regNo)
router.get('/regno/:regNo', async (req, res) => {
  try {
    const regNo = req.params.regNo;
    let student = await SemesterMark.findOne({ regNo });
    if (!student) {
      student = await SemesterMark.findOne({ regNo: Number(regNo) });
    }
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug/test endpoint to list all regNo values in the SemesterMark collection
router.get('/test/regnos', async (req, res) => {
  try {
    const students = await SemesterMark.find({}, { regNo: 1, _id: 0 });
    res.json({ success: true, regNos: students.map(s => s.regNo) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: GET /match/student/:studentId
// Fetch semester marks by matching rollNo and Register from Student collection to semestermarks collection
router.get('/match/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Use the exact field names as in your schema
    const register = student.Register && student.Register.trim();
    const rollNo = student.Roll && student.Roll.trim();

    // Debug log
    console.log('Looking for marks with regNo:', register, 'or rollNo:', rollNo);

    let marks = await SemesterMark.findOne({ regNo: register });
    if (!marks && rollNo) {
      marks = await SemesterMark.findOne({ rollNo: rollNo });
    }
    if (!marks) {
      console.log('No marks found for regNo:', register, 'or rollNo:', rollNo);
      return res.status(404).json({ success: false, message: 'No semester marks found for this student.' });
    }
    res.json({ success: true, student: marks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;