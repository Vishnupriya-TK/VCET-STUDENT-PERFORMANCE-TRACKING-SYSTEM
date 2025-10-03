import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const gradePoints = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'U': 0,
  'RA': 0,
  'SA': 0,
  'W': 0
};

const gradeOptions = Object.keys(gradePoints);

const CGPACalculator = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([
    { code: '', grade: '', credits: '' }
  ]);
  const [gpa, setGpa] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef();
  const [semesters, setSemesters] = useState([{ sem: '', gpa: '' }]);
  const [cgpa, setCgpa] = useState(null);

  const handleCourseChange = (idx, field, value) => {
    const updated = courses.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    setCourses(updated);
  };

  const handleAddCourse = () => {
    setCourses([...courses, { code: '', grade: '', credits: '' }]);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(({ grade, credits }) => {
      const gp = gradePoints[grade] || 0;
      const cr = parseFloat(credits) || 0;
      totalPoints += gp * cr;
      totalCredits += cr;
    });
    const result = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpa(result);
    setShowTable(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CGPA Calculator Result', 14, 15);
    doc.setFontSize(12);
    doc.text(`Roll Number: ${user?.Roll || ''}`, 14, 25);
    doc.text(`Register Number: ${user?.Register || ''}`, 14, 32);
    doc.autoTable({
      startY: 40,
      head: [['Course Code', 'Grade', 'Credits']],
      body: courses.map(c => [c.code, c.grade, c.credits]),
      theme: 'grid',
    });
    const tableY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 60;
    doc.text(`GPA: ${gpa}`, 14, tableY + 10);
    doc.save('gpa_result.pdf');
  };

  const handleSemesterChange = (idx, field, value) => {
    const updated = semesters.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setSemesters(updated);
    const validGpas = updated.map(s => parseFloat(s.gpa)).filter(g => !isNaN(g));
    if (validGpas.length > 0) {
      const avg = (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2);
      setCgpa(avg);
    } else {
      setCgpa(null);
    }
  };

  const handleAddSemester = () => {
    setSemesters([...semesters, { sem: '', gpa: '' }]);
  };

  useEffect(() => {
    const regNo = user?.regNo || user?.regno || user?.Register || user?.['Register'] || user?.register;
    console.log('Fetching academic performance for regNo:', regNo);
    if (!regNo) return;
  }, [user]);

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>GPA Calculator</Typography>
          <Typography fontWeight={500} mb={1}>Roll Number: {user?.Roll || 'Not provided'}</Typography>
          <Typography fontWeight={500} mb={2}>Register Number: {user?.Register || 'Not provided'}</Typography>
          <form onSubmit={handleCalculate}>
            <Grid container spacing={2}>
              {courses.map((course, idx) => (
                <React.Fragment key={idx}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Course Code" value={course.code} onChange={e => handleCourseChange(idx, 'code', e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField select label="Grade" value={course.grade} onChange={e => handleCourseChange(idx, 'grade', e.target.value)} fullWidth required>
                      {gradeOptions.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField label="Credits" type="number" value={course.credits} onChange={e => handleCourseChange(idx, 'credits', e.target.value)} fullWidth required inputProps={{ min: 0 }} />
                  </Grid>
                  {idx === courses.length - 1 && (
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={handleAddCourse} color="primary"><AddIcon /></IconButton>
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
            <Box mt={3}>
              <Button variant="contained" color="primary" type="submit">Calculate GPA</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      {showTable && (
        <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)', color: '#2D264B', p: 3, mt: 4 }}>
          <CardContent>
            <Box mb={2}>
              <Typography fontWeight={500}>Roll Number: {user?.Roll || 'Not provided'}</Typography>
              <Typography fontWeight={500} mb={2}>Register Number: {user?.Register || 'Not provided'}</Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small" ref={tableRef}>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Course Code</b></TableCell>
                    <TableCell><b>Grade</b></TableCell>
                    <TableCell><b>Credits</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{c.grade}</TableCell>
                      <TableCell>{c.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography mt={2} fontWeight={600} fontSize={18}>GPA: {gpa}</Typography>
          </CardContent>
        </Card>
      )}
      <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3, mt: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>CGPA Calculator</Typography>
          <Grid container spacing={2}>
            {semesters.map((sem, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Semester" value={sem.sem} onChange={e => handleSemesterChange(idx, 'sem', e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField label="GPA" type="number" value={sem.gpa} onChange={e => handleSemesterChange(idx, 'gpa', e.target.value)} fullWidth required inputProps={{ min: 0, step: 0.01 }} />
                </Grid>
                {idx === semesters.length - 1 && (
                  <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleAddSemester} color="primary"><AddIcon /></IconButton>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
          {cgpa && (
            <Box mt={3}>
              <Typography fontWeight={600} fontSize={18}>CGPA: {cgpa}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CGPACalculator; 