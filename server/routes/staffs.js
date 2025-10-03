const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'VCET-SPS_SYSTEM';

router.get('/:staffId', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const staff = await db.collection('Staffs').findOne({ StaffId: req.params.staffId });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    await client.close();
  }
});

// GET class incharge by batch, section, dept
router.get('/classincharge', async (req, res) => {
  const { batch, section, dept } = req.query;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    // Try both field name variants for compatibility
    const queryVariants = [
      {
        ClassIncharge: "YES",
        "Batch ": batch,
        "Section ": section,
        Department: dept
      },
      {
      ClassIncharge: "YES",
      Batch: batch,
      Section: section,
      Dept: dept
      }
    ];
    let staff = null;
    for (const query of queryVariants) {
      staff = await db.collection('Staffs').findOne(query);
      if (staff) break;
    }
    if (!staff) return res.json({ success: false, message: 'Staff not found' });
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    await client.close();
  }
});

module.exports = router;