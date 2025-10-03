const mongoose = require('mongoose');
const GradeAnalysis = require('./models/GradeAnalysis');

async function testGradeAnalysis() {
  try {
    await mongoose.connect('mongodb://localhost:27017/VCET-SPS_SYSTEM', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test data
    const testData = {
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
          subjectCode: "21CS101",
          subjectName: "Problem Solving and Python Programming",
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
        }
      ]
    };

    console.log('Attempting to save test data...');
    
    // Try to save using the same logic as the route
    const filter = { 
      batchId: testData.batchId, 
      sectionId: testData.sectionId, 
      departmentId: testData.departmentId, 
      semester: testData.semester 
    };
    
    const update = {
      $set: {
        classIncharge: testData.classIncharge,
        subjectAnalysis: testData.subjectAnalysis,
        lastUpdated: new Date()
      }
    };

    const result = await GradeAnalysis.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });

    console.log('Test data saved successfully:', result);

    // Test fetching
    const fetched = await GradeAnalysis.findOne(filter);
    console.log('Fetched data:', fetched);

    await mongoose.connection.close();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testGradeAnalysis(); 