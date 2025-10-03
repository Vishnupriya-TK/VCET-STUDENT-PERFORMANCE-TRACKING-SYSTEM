const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const semesterMarksRoute = require('./routes/semesterMarks');
const staffRoutes = require('./routes/staffs');
const mongoose = require('mongoose');
const semesterMarksRoutes = require('./routes/semesterMarks');
mongoose.connect('mongodb://localhost:27017/VCET-SPS_SYSTEM', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/marks', semesterMarksRoute);
app.use('/api/staffs', staffRoutes);
app.use('/api/semesterMarks', semesterMarksRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));