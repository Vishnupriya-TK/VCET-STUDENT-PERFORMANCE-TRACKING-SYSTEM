import React, { useEffect, useState, useRef } from 'react';
import Layout from './Layout';
import { Typography, Paper, Box, CircularProgress, MenuItem, Select, FormControl, InputLabel, Button, Divider } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import { useAuth } from '../../contexts/AuthContext';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import { courseData } from './SemesterMarksCourseData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
const gradePoints = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0, RA: 0, SA: 0, W: 0 };
const gradeLabels = Object.keys(gradePoints);

const AcademicPerformance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [allSemesters, setAllSemesters] = useState([]);
  const pieChartRef = useRef(null);

  // Fetch only students and marks for the current class (batch/section/year)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const batch = user['Batch '] || user.Batch;
        const section = user['Section '] || user.Section;

        // 1. Fetch all students for this class
        let stuData = { students: [] };
        try {
          const stuRes = await fetch(`http://localhost:5000/api/students/classincharge?batchId=${batch}&sectionId=${section}`);
          stuData = await stuRes.json();
          console.log('Fetched students:', stuData);
        } catch (err) {
          console.error('Error fetching students:', err);
        }

        // 2. Fetch all marks
        let marksData = { students: [] };
        try {
          const marksRes = await fetch('http://localhost:5000/api/marks/all');
          marksData = await marksRes.json();
          console.log('Fetched marks:', marksData);
        } catch (err) {
          console.error('Error fetching marks:', err);
        }

        // 3. Merge marks into students (like AcademicPerformance)
        const marksMap = {};
        (marksData.students || []).forEach(m => { marksMap[m.regNo] = m; });
        const merged = (stuData.students || []).map(s => ({
          ...s,
          cgpa: marksMap[s.Register]?.cgpa || 0,
          semesters: marksMap[s.Register]?.semesters || {}
        }));
        setStudents(merged);

        // 4. Find all semesters present in the data
        const semesters = Array.from(new Set(
          merged.flatMap(s => Object.keys(s.semesters || {}))
        )).sort();
        setAllSemesters(semesters);
        setSelectedSemester(semesters[0] || '');

        // 5. Mentorwise grouping (same as before)
        const mentorRes = await fetch(`http://localhost:5000/api/students/mentorwise?batchId=${batch}&sectionId=${section}`);
        const mentorData = await mentorRes.json();
        const mentors = mentorData.mentors || [];
        const mentorDetailsMap = {};
        await Promise.all(mentors.map(async (m) => {
          if (m.mentorId && m.mentorId !== 'undefined' && m.mentorId !== 'null') {
            const res = await fetch(`http://localhost:5000/api/staffs/${m.mentorId}`);
            const data = await res.json();
            if (data.success && data.staff) mentorDetailsMap[m.mentorId] = data.staff;
          }
        }));
        setMentorStats(mentors.map(m => ({ ...m, mentorDetails: mentorDetailsMap[m.mentorId] })));
        setMentorsMap(mentorDetailsMap);

        // 6. CGPA stats from merged data
        const cgpas = merged.map(s => Number(s.cgpa) || 0).filter(Boolean);
        const avg = cgpas.length ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : '-';
        const high = cgpas.length ? Math.max(...cgpas) : '-';
        const low = cgpas.length ? Math.min(...cgpas) : '-';
        setCgpaStats({ avg, high, low });

        setLoading(false);
      } catch (err) {
        console.error('AcademicPerformance fetch error:', err);
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <Layout><Paper sx={{ p: 4, mb: 3 }}><CircularProgress /></Paper></Layout>;
  if (!students.length) return <Layout><Paper sx={{ p: 4, mb: 3 }}>No data found.</Paper></Layout>;

  // Filter all data by selected semester
  const filteredStudents = students.filter(s => s.semesters && s.semesters[selectedSemester]);

  // GPA for all students in this semester
  const gpas = filteredStudents.map(s => Number(s.semesters?.[selectedSemester]?.gpa) || 0).filter(Boolean);
  const avgGPA = gpas.length ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : '-';
  const highestGPA = gpas.length ? Math.max(...gpas) : '-';
  const lowestGPA = gpas.length ? Math.min(...gpas) : '-';

  // Course analysis for selected semester
  const allCourses = Array.from(new Set(filteredStudents.flatMap(s => Object.keys(s.semesters?.[selectedSemester]?.marks || {}))));
  const courseAnalysis = allCourses.map(course => {
    const grades = filteredStudents.map(s => gradePoints[s.semesters?.[selectedSemester]?.marks?.[course]]).filter(g => g !== undefined);
    const avg = grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2) : '-';
    const highest = grades.length ? Math.max(...grades) : '-';
    const lowest = grades.length ? Math.min(...grades) : '-';
    // Grade distribution for chart
    const gradeDist = gradeLabels.map(label => ({
      grade: label,
      count: filteredStudents.filter(s => (s.semesters?.[selectedSemester]?.marks?.[course] === label)).length
    }));
    return { course, avg, highest, lowest, gradeDist };
  });

  // Bar chart data for all courses
  const courseBarData = courseAnalysis.map(course => {
    const obj = { course: course.course };
    course.gradeDist.forEach(g => { obj[g.grade] = g.count; });
    return obj;
  });

  // CGPA analysis for the class
  const cgpas = students.map(s => Number(s.cgpa) || 0).filter(Boolean);
  const avgCGPA = cgpas.length ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : '-';
  const highestCGPA = cgpas.length ? Math.max(...cgpas) : '-';
  const lowestCGPA = cgpas.length ? Math.min(...cgpas) : '-';

  // Export as PDF for selected semester (summary, charts, and CGPA analysis)
  const exportToPDF = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;
    // Header
    doc.setFontSize(16);
    doc.setTextColor(76, 0, 110); // Deep purple
    doc.text('Velammal College of Engineering and Technology, Madurai', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210); // Blue
    doc.text('Department of Computer Science and Engineering', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Semester ${selectedSemester} Performance Analysis`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 15, y);
    y += 7;
    // Divider before summary
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.7);
    doc.line(10, y, pageWidth - 10, y);
    y += 3;
    // Summary Section
    doc.setFontSize(13);
    doc.setTextColor(25, 118, 210);
    doc.setFont(undefined, 'bold');
    doc.text('Semester Summary', 15, y + 7);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let summaryY = y + 14;
    doc.text(`• Average GPA: ${avgGPA}`, 15, summaryY); summaryY += 5.5;
    doc.text(`• Highest GPA: ${highestGPA}`, 15, summaryY); summaryY += 5.5;
    doc.text(`• Lowest GPA: ${lowestGPA}`, 15, summaryY); summaryY += 5.5;
    courseAnalysis.forEach(course => {
      doc.text(`• Course ${course.course}: Avg Grade Point: ${course.avg}, Highest: ${course.highest}, Lowest: ${course.lowest}`, 15, summaryY);
      summaryY += 5.5;
    });
    y = summaryY + 3;
    // Divider before bar chart
    doc.line(10, y, pageWidth - 10, y);
    y += 3;
    // Bar Chart Section
    doc.setFontSize(13);
    doc.setTextColor(56, 142, 60);
    doc.setFont(undefined, 'bold');
    doc.text('Course Grade Distribution (Bar Chart)', 15, y + 7);
    doc.setFont(undefined, 'normal');
    // Wait for bar chart to render
    await new Promise((resolve) => setTimeout(resolve, 500));
    const barChartNode = document.getElementById('bar-chart-container');
    if (barChartNode) {
      try {
        const barChartImg = await domtoimage.toPng(barChartNode);
        doc.addImage(barChartImg, 'PNG', 15, y + 10, pageWidth - 30, 35);
      } catch (err) {
        doc.setFontSize(10);
        doc.setTextColor(200, 0, 0);
        doc.text('Bar chart image could not be captured.', 15, y + 15);
      }
    } else {
      doc.setFontSize(10);
      doc.setTextColor(200, 0, 0);
      doc.text('Bar chart not found.', 15, y + 15);
    }
    y += 50;
    // Pie Charts for each course
    for (let i = 0; i < courseAnalysis.length; i++) {
      const course = courseAnalysis[i];
      const pieId = `pie-chart-${course.course}`;
      const pieNode = document.getElementById(pieId);
      // Wait for pie chart to render
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (pieNode) {
        // Divider before each pie chart
        doc.line(10, y, pageWidth - 10, y);
        y += 3;
        doc.setFontSize(13);
        doc.setTextColor(76, 0, 110);
        doc.setFont(undefined, 'bold');
        // Find course name from courseData
        let courseObj = null;
        for (const sem in courseData) {
          const found = courseData[sem].find(c => c.code === course.course);
          if (found) { courseObj = found; break; }
        }
        doc.text(`Grade Distribution for Course ${course.course}${courseObj ? ` (${courseObj.name})` : ''}`, 15, y + 7);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text('Number of students per grade for this course', 15, y + 14);
        try {
          const canvas = await html2canvas(pieNode);
          const pieImage = canvas.toDataURL('image/png');
          doc.addImage(pieImage, 'PNG', 15, y + 17, 40, 30);
        } catch (err) {
          // Do not add any error message to the PDF if pie chart image could not be captured
        }
        y += 55;
      }
    }
    // Divider before CGPA analysis
    doc.line(10, y, pageWidth - 10, y);
    y += 3;
    // CGPA Analysis Section (visually distinct)
    doc.setFontSize(14);
    doc.setTextColor(255, 214, 0);
    doc.setFont(undefined, 'bold');
    doc.text('CGPA Analysis (Overall Class)', 15, y + 8);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Average CGPA: ${avgCGPA}`, 15, y + 16);
    doc.text(`• Highest CGPA: ${highestCGPA}`, 80, y + 16);
    doc.text(`• Lowest CGPA: ${lowestCGPA}`, 150, y + 16);
    doc.save(`Semester_${selectedSemester}_Performance_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
  <Layout>
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: '#f3eaff', borderLeft: '6px solid #7c4dff', position: 'relative' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <SchoolIcon sx={{ color: '#7c4dff', mr: 1 }} />
          <Typography variant="h5" fontWeight={700}>Academic Performance</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            onClick={exportToPDF}
            sx={{ bgcolor: 'rgb(188, 136, 244)', color: '#4B006E', fontWeight: 700, boxShadow: 2, ml: 2, '&:hover': { bgcolor: 'rgb(221, 153, 238)' } }}
          >
            Export as PDF
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          {`Batch: ${user['Batch '] || user.Batch || '2022-2026'} | Section: ${user['Section '] || user.Section || ''} | Semester: ${selectedSemester}`}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {`Date: ${new Date().toLocaleDateString('en-IN')}`}
        </Typography>
      </Paper>

      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Select Semester</InputLabel>
        <Select
          value={selectedSemester}
          label="Select Semester"
          onChange={e => setSelectedSemester(e.target.value)}
        >
          {allSemesters.map(sem => (
            <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f3eaff', borderLeft: '6px solid #1976d2' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <TrendingUpIcon sx={{ color: '#1976d2', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>Semester Summary</Typography>
        </Box>
        <ul>
          <li>Average GPA: <b>{avgGPA}</b></li>
          <li>Highest GPA: <b>{highestGPA}</b></li>
          <li>Lowest GPA: <b>{lowestGPA}</b></li>
          {courseAnalysis.map(course => (
            <li key={course.course}>
              Course <b>{course.course}</b>: Average Grade Point: <b>{course.avg}</b>, Highest: <b>{course.highest}</b>, Lowest: <b>{course.lowest}</b>
            </li>
          ))}
        </ul>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <BarChartIcon sx={{ color: '#388e3c', mr: 1 }} />
        Course Grade Distribution (Bar Chart)
      </Typography>
      <div id="bar-chart-container" style={{ width: '100%', height: 350, background: 'rgb(230, 211, 247)', borderRadius: 8, padding: 8 }}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={courseBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course" label={{ value: 'Course Code', position: 'insideBottom', offset: -5 }} />
            <YAxis allowDecimals={false} label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {gradeLabels.map((grade, idx) => (
              <Bar key={grade} dataKey={grade} stackId="a" fill={COLORS[idx % COLORS.length]} name={grade} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {courseAnalysis.map(course => {
        // Find course name from courseData
        let courseObj = null;
        for (const sem in courseData) {
          const found = courseData[sem].find(c => c.code === course.course);
          if (found) { courseObj = found; break; }
        }
        console.log('Pie chart data for', course.course, course.gradeDist);
        const pieChartData = course.gradeDist || [];
        return (
          <Box key={course.course} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#4B006E', mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Grade Distribution for Course {course.course}{courseObj ? ` (${courseObj.name})` : ''}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, textAlign: 'center' }}>
              Number of students per grade for this course
            </Typography>
            <div ref={pieChartRef}>
              {pieChartData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={entry => `${entry.grade}: ${entry.count}`}
                  >
                    {pieChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <Typography color="error">Pie chart not found.</Typography>
              )}
            </div>
          </Box>
        );
      })}

      <Paper elevation={2} sx={{ p: 2, mt: 4, background: '#f3eaff', borderLeft: '6px solid rgb(185, 102, 248)' }}>
        <Typography variant="h6" fontWeight={600}>CGPA Analysis (Overall Class)</Typography>
        <ul>
          <li>Average CGPA: <b>{avgCGPA}</b></li>
          <li>Highest CGPA: <b>{highestCGPA}</b></li>
          <li>Lowest CGPA: <b>{lowestCGPA}</b></li>
        </ul>
    </Paper>
    </Box>
  </Layout>
);
};

export default AcademicPerformance; 