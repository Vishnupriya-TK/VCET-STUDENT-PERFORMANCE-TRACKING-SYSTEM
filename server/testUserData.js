const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'VCET-SPS_SYSTEM';

async function testUserData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Get a sample staff member
    const staff = await db.collection('Staffs').findOne({});
    console.log('Sample staff data:', JSON.stringify(staff, null, 2));
    
    // Get a sample student
    const student = await db.collection('Students').findOne({});
    console.log('Sample student data:', JSON.stringify(student, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testUserData(); 