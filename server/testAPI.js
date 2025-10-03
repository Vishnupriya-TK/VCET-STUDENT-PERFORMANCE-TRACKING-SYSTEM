const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test data
    const testData = {
      batchId: "2024-2028",
      sectionId: "A",
      departmentId: "CSE",
      semester: "01",
      classIncharge: {
        name: "Test Incharge",
        staffId: "TEST001"
      },
      subjectAnalysis: [
        {
          subjectCode: "21CS101",
          subjectName: "Test Subject",
          grades: {
            O: 1,
            'A+': 2,
            A: 3,
            'B+': 4,
            B: 5,
            C: 6,
            U: 0,
            RA: 0,
            SA: 0,
            W: 0
          }
        }
      ]
    };

    // Test POST
    console.log('Testing POST /api/marks/analysis...');
    const postResponse = await fetch('http://localhost:5000/api/marks/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('POST Response status:', postResponse.status);
    const postData = await postResponse.json();
    console.log('POST Response:', postData);

    // Test GET
    console.log('Testing GET /api/marks/analysis...');
    const getResponse = await fetch(
      `http://localhost:5000/api/marks/analysis?batchId=${testData.batchId}&sectionId=${testData.sectionId}&departmentId=${testData.departmentId}&semester=${testData.semester}`
    );

    console.log('GET Response status:', getResponse.status);
    const getData = await getResponse.json();
    console.log('GET Response:', getData);

  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI(); 