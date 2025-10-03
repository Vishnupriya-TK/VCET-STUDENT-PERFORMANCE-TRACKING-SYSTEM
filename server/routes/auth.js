const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Update if needed
const dbName = 'VCET-SPS_SYSTEM';
router.post('/login', async (req, res) => {
    const { role, user, password } = req.body;
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const db = client.db(dbName);
  
      if (role === 'Student') {
        const student = await db.collection('Students').findOne({
          Register: Number(user),
          Roll: password,
        });
        if (student) {
          console.log('Student found:', student);
          return res.json({ success: true, role: 'student', user: student });
        }
      } else {
        const staff = await db.collection('Staffs').findOne({
          EmailId: user,
          StaffId: password,
        });
        if (staff) {
          let staffRole = '';
          if (staff.Hod === 'YES') staffRole = 'hod';
          else if (staff.ClassIncharge === 'YES') staffRole = 'class-incharge';
          else if (staff.Mentor === 'YES') staffRole = 'mentor';
          else staffRole = 'staff';
          console.log('Staff found:', staff, 'Role:', staffRole);
          return res.json({ success: true, role: staffRole, user: staff });
        }
      }
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    } finally {
      await client.close();
    }
  });

module.exports = router;