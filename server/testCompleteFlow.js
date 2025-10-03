const mongoose = require('mongoose');
const GradeAnalysis = require('./models/GradeAnalysis');

async function testCompleteFlow() {
  try {
    await mongoose.connect('mongodb://localhost:27017/VCET-SPS_SYSTEM', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test data that matches the frontend structure
    const testData = {
      batchId: "2024-2028",
      sectionId: "A",
      departmentId: "CSE",
      semester: "01",
      classIncharge: {
        name: "Dr.R.Perumal raja",
        staffId: "IT1336"
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

    console.log('Testing with data:', JSON.stringify(testData, null, 2));
    
    // Test saving
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

    console.log('Save result:', result);

    // Test fetching
    const fetched = await GradeAnalysis.findOne(filter);
    console.log('Fetch result:', fetched);

    await mongoose.connection.close();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testCompleteFlow(); 