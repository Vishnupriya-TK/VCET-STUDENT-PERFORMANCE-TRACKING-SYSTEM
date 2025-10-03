const mongoose = require('mongoose');
const GradeAnalysis = require('./models/GradeAnalysis');

async function initGradeAnalysis() {
  try {
    await mongoose.connect('mongodb://localhost:27017/VCET-SPS_SYSTEM', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await GradeAnalysis.deleteMany({});

    // Create sample data
    const sampleAnalysis = {
      batchId: "2023",
      sectionId: "A",
      departmentId: "CSE",
      semester: "01",
      classIncharge: {
        name: "Test Incharge",
        staffId: "CSE001"
      },
      subjectAnalysis: [
        {
          subjectCode: "21CH101",
          subjectName: "Engineering Chemistry",
          grades: {
            O: 5,
            'A+': 10,
            A: 15,
            'B+': 8,
            B: 4,
            C: 2,
            U: 0,
            RA: 0,
            SA: 0,
            W: 0
          }
        },
        {
          subjectCode: "21CS101",
          subjectName: "Problem Solving and Python Programming",
          grades: {
            O: 3,
            'A+': 12,
            A: 10,
            'B+': 7,
            B: 5,
            C: 3,
            U: 0,
            RA: 0,
            SA: 0,
            W: 0
          }
        }
      ]
    };

    const result = await GradeAnalysis.create(sampleAnalysis);
    console.log('Sample grade analysis created:', result);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initGradeAnalysis(); 