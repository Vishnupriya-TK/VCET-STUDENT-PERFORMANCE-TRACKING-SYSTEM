import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Layout from './Layout';
import { useAuth } from '../../contexts/AuthContext';

// Course data
const courseData = {
  "01": [
    { code: "21CH101", name: "Engineering Chemistry", shortForm: "CHEM", credits: 3 },
    { code: "21CS101", name: "Problem Solving and Python Programming", shortForm: "PSP", credits: 3 },
    { code: "21CS102", name: "Problem Solving and Python Programming Laboratory", shortForm: "PSPL", credits: 2 },
    { code: "21PC101", name: "Physics and Chemistry Laboratory", shortForm: "PCL", credits: 2 },
    { code: "21EN101", name: "Professional English-I", shortForm: "ENG1", credits: 4 },
    { code: "21MA101", name: "Matrices and Calculus", shortForm: "MAT", credits: 4 },
    { code: "21PH101", name: "Engineering Physics", shortForm: "PHY", credits: 3 },
    { code: "21TA101", name: "Heritage of Tamils", shortForm: "HT", credits: 1 }
  ],
  "02": [
    { code: "21CS103", name: "Programming in C", shortForm: "C", credits: 3 },
    { code: "21CS104", name: "Programming in C Laboratory", shortForm: "CL", credits: 2 },
    { code: "21EE104", name: "Basic Electrical and Electronics Engineering for Information Science", shortForm: "BEEE", credits: 3 },
    { code: "21EN102", name: "English-II", shortForm: "ENG2", credits: 3 },
    { code: "21MA103", name: "Sampling Techniques and Numerical Methods", shortForm: "STM", credits: 4 },
    { code: "21ME101", name: "Engineering Graphics", shortForm: "EG", credits: 3 },
    { code: "21PH103", name: "Physics for Information Science", shortForm: "PIS", credits: 3 },
    { code: "21TA102", name: "Tamils and Technology", shortForm: "TT", credits: 1 },
    { code: "21EM101", name: "Engineering Practices Laboratory", shortForm: "EPL", credits: 2 },
    { code: "21CH103", name: "Environmental Science", shortForm: "ENV", credits: 2 }
  ],
  "03": [
    { code: "21CS201", name: "Computer Organization and Architecture", shortForm: "COA", credits: 3 },
    { code: "21CS202", name: "Data Structures", shortForm: "DS", credits: 3 },
    { code: "21CS203", name: "Object Oriented Programming", shortForm: "OOP", credits: 3 },
    { code: "21CS204", name: "Data Structures Laboratory", shortForm: "DSL", credits: 2 },
    { code: "21CS205", name: "Object Oriented Programming Laboratory", shortForm: "OOPL", credits: 2 },
    { code: "21EC201", name: "Digital Principles and System Design", shortForm: "DP", credits: 4 },
    { code: "21EC212", name: "Digital Systems Laboratory", shortForm: "DSL", credits: 2 },
    { code: "21MA203", name: "Discrete Mathematics", shortForm: "DM", credits: 4 }
  ],
  "04": [
    { code: "21MA205", name: "Stochastic Process and its Applications", shortForm: "SPA", credits: 4 },
    { code: "21CS206", name: "Database Management Systems", shortForm: "DBMS", credits: 3 },
    { code: "21CS207", name: "Design Analysis of Algorithms", shortForm: "DAA", credits: 3 },
    { code: "21CS208", name: "Operating Systems", shortForm: "OS", credits: 3 },
    { code: "21CS209", name: "Internet Programming", shortForm: "IP", credits: 3 },
    { code: "21CS210", name: "Database Management Systems Laboratory", shortForm: "DBMSL", credits: 2 },
    { code: "21CS211", name: "Operating Systems Laboratory", shortForm: "OSL", credits: 2 },
    { code: "21CS212", name: "Internet Programming Laboratory", shortForm: "IPL", credits: 2 }
  ],
  "05": [
    { code: "21CS301", name: "Theory of Computation", shortForm: "TOC", credits: 3 },
    { code: "21MCCS01", name: "Constitution of India", shortForm: "CI", credits: 0 },
    { code: "21CS302", name: "Computer Networks", shortForm: "CN", credits: 4 },
    { code: "21CS303", name: "Artificial Intelligence and Machine Learning", shortForm: "AIML", credits: 4 },
    { code: "21CS304", name: "Object Oriented Software Engineering", shortForm: "OOSE", credits: 4 },
    { code: "21PCS02", name: "Exploratory Data Analysis", shortForm: "EDA", credits: 3 },
    { code: "21PCS12", name: "Android App Development", shortForm: "AAD", credits: 3 },
    { code: "Intern01", name: "Internship", shortForm: "INT", credits: 1 }
  ],
  "06": [
    { code: "21CS305", name: "Compiler Design", shortForm: "CD", credits: 3 },
    { code: "21CS306", name: "Data Science (TwP)", shortForm: "DS", credits: 3 },
    { code: "21PEC27", name: "Industrial IoT and Industry 4.0", shortForm: "I4", credits: 3 },
    { code: "21PME40", name: "Entrepreneurship Development", shortForm: "ED", credits: 3 },
    { code: "21PCS14", name: "Software Testing and Automation (TwP)", shortForm: "STA", credits: 3 },
    { code: "21PCS19", name: "Software Defined Networks (TwP)", shortForm: "SDN", credits: 3 },
    { code: "21PCS08", name: "Essentials of Business Analytics (TwP)", shortForm: "EBA", credits: 3 },
    { code: "21PCS20", name: "Cloud Computing and Virtualization (TwP)", shortForm: "CCV", credits: 3 }
  ],
  "07": [
    { code: "21CS401", name: "Distributed Systems", shortForm: "DS", credits: 3 },
    { code: "21PEC57", name: "Mobile Communication", shortForm: "MC", credits: 3 },
    { code: "21PCS08", name: "Essentials of Business Analytics (TwP)", shortForm: "EBA", credits: 3 }
  ],
  "08": [
    { code: "21PCS20", name: "Cloud Computing and Virtualization (TwP)", shortForm: "CCV", credits: 3 }
  ]
};

// Semester mapping
const numberToSemester = {
  '01': 'I Year / I Semester',
  '02': 'I Year / II Semester',
  '03': 'II Year / III Semester',
  '04': 'II Year / IV Semester',
  '05': 'III Year / V Semester',
  '06': 'III Year / VI Semester',
  '07': 'IV Year / VII Semester',
  '08': 'IV Year / VIII Semester'
};

// Grade points mapping
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

const gradeOptions = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U', 'RA', 'SA', 'W'];

const SemesterMarks = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [gpaBySemester, setGpaBySemester] = useState({});
  const [gradeCounts, setGradeCounts] = useState({});
  const [registerNoFilter, setRegisterNoFilter] = useState('');

  // Filtering logic (always use for both tables and export)
  const filteredStudents = useMemo(() => {
    const filter = registerNoFilter.toLowerCase();
    return studentsData.filter(student =>
      (student.regNo && student.regNo.toLowerCase().includes(filter)) ||
      (student.name && student.name.toLowerCase().includes(filter)) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(filter))
    );
  }, [studentsData, registerNoFilter]);

  // Fetch students data when component mounts
  useEffect(() => {
    fetchStudentsData();
  }, [user]);

  // Fetch grade analysis when semester changes
  useEffect(() => {
    if (selectedSemester && user) {
      fetchGradeAnalysis();
    }
  }, [selectedSemester, user]);

  const fetchGradeAnalysis = async () => {
    try {
      console.log('Fetching grade analysis with params:', {
        batchId: user['Batch '] || user.Batch,
        sectionId: user['Section '] || user.Section,
        departmentId: user.Dept || user.Department,
        semester: selectedSemester
      });
      
      const response = await fetch(
        `http://localhost:5000/api/marks/analysis?batchId=${user['Batch '] || user.Batch}&sectionId=${user['Section '] || user.Section}&departmentId=${user.Dept || user.Department}&semester=${selectedSemester}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Grade analysis response:', data);
      
      if (data.success && data.analysis) {
        // Convert the analysis data back to the format component expects
        const analysisMap = {};
        data.analysis.subjectAnalysis.forEach(subject => {
          analysisMap[subject.subjectCode] = subject.grades;
        });
        setGradeCounts(analysisMap);
      } else {
        console.log('No existing grade analysis found, will create new');
        // Initialize empty grade counts for all subjects
        const emptyCounts = {};
        courseData[selectedSemester]?.forEach(course => {
          emptyCounts[course.code] = {
            O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, U: 0, RA: 0, SA: 0, W: 0
          };
        });
        setGradeCounts(emptyCounts);
      }
    } catch (err) {
      console.error('Error fetching grade analysis:', err);
      setError('Failed to fetch grade analysis');
    }
  };

  // Save grade analysis whenever it changes
  useEffect(() => {
    if (selectedSemester && user && Object.keys(gradeCounts).length > 0) {
      saveGradeAnalysis();
    }
  }, [gradeCounts, selectedSemester, user]);

  const saveGradeAnalysis = async () => {
    if (!selectedSemester || !user || Object.keys(gradeCounts).length === 0) {
      console.log('Missing required data for saving grade analysis');
      return;
    }

    try {
      console.log('Saving grade analysis:', {
        gradeCounts,
        user,
        selectedSemester
      });

      // Convert gradeCounts to the format expected by the backend
      const subjectAnalysis = Object.entries(gradeCounts).map(([subjectCode, grades]) => ({
        subjectCode,
        subjectName: courseData[selectedSemester].find(c => c.code === subjectCode)?.name || '',
        grades
      }));

      const analysisData = {
        batchId: user['Batch '] || user.Batch,
        sectionId: user['Section '] || user.Section,
        departmentId: user.Dept || user.Department,
        semester: selectedSemester,
        classIncharge: {
          name: user.Name,
          staffId: user.StaffId
        },
        subjectAnalysis
      };

      const response = await fetch('http://localhost:5000/api/marks/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Grade analysis saved:', data);
    } catch (err) {
      console.error('Error saving grade analysis:', err);
      setError('Failed to save grade analysis');
    }
  };

  // Update grade counts whenever student data or semester changes
  useEffect(() => {
    const newGradeCounts = {};
    if (selectedSemester && courseData[selectedSemester]) {
      courseData[selectedSemester].forEach(subject => {
        newGradeCounts[subject.code] = { O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, U: 0, RA: 0, SA: 0, W: 0 };
        if (studentsData && studentsData.length > 0) {
          studentsData.forEach(student => {
            const grade = student.semesters?.[selectedSemester]?.marks?.[subject.code];
            if (grade && newGradeCounts[subject.code][grade] !== undefined) {
              newGradeCounts[subject.code][grade] = (newGradeCounts[subject.code][grade] || 0) + 1;
            }
          });
        }
      });
      setGradeCounts(newGradeCounts);
    }
  }, [selectedSemester, studentsData]);

  const fetchStudentsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all students (main list)
      const studentsRes = await fetch(`http://localhost:5000/api/students/classincharge?batchId=${user['Batch '] || user.Batch}&sectionId=${user['Section '] || user.Section}`);
      const studentsData = await studentsRes.json();
      // Fetch all marks
      const marksRes = await fetch('http://localhost:5000/api/marks/all');
      const marksData = await marksRes.json();
      if (studentsData.success && marksData.success) {
        const marksMap = {};
        if (marksData.students && Array.isArray(marksData.students)) {
          marksData.students.forEach(m => { marksMap[m.regNo] = m; });
        }
        // Merge: for each student, attach semesters/cgpa if available
        const merged = studentsData.students.map(s => ({
          regNo: s.Register,
          name: s.Name,
          rollNo: s.Roll,
          semesters: marksMap[s.Register]?.semesters || {},
          cgpa: marksMap[s.Register]?.cgpa || 0
        }));
        setStudentsData(merged);
        setError(null);
      } else {
        setError('Failed to fetch students or marks data');
      }
    } catch (err) {
      setError('Failed to fetch students or marks data');
    }
    setIsLoading(false);
  };

  const calculateGPA = (studentMarks) => {
    if (!studentMarks || Object.keys(studentMarks).length === 0) return 0;
    
    const currentSemesterCourses = courseData[selectedSemester] || [];
    let totalCredits = 0;
    let totalGradePoints = 0;

    currentSemesterCourses.forEach(course => {
      const grade = studentMarks[course.code];
      if (grade && gradePoints[grade] !== undefined) {
        totalCredits += course.credits;
        totalGradePoints += gradePoints[grade] * course.credits;
      }
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
  };

  const calculateCGPA = (gpaBySemester) => {
    const gpas = Object.values(gpaBySemester).filter(g => !isNaN(g) && g > 0);
    if (gpas.length === 0) return 0;
    const sum = gpas.reduce((a, b) => a + b, 0);
    return (sum / gpas.length).toFixed(2);
  };

  // Export as Excel (CGPA format)
  const exportToExcel = () => {
    if (!studentsData.length) {
      setError('No data to export');
      return;
    }
    try {
      const wb = XLSX.utils.book_new();
      let ws, allData;
      if (!selectedSemester) {
        // Add headers to match PDF
        const headerRows = [
          ['Velammal College of Engineering and Technology, Madurai'],
          ['Department of Computer Science and Engineering'],
          [`Date: ${new Date().toLocaleDateString('en-IN')}`],
          [], // Empty row for spacing
          ['Register No', 'Name', 'Roll No', 'CGPA']
        ];
        const rows = filteredStudents.map(student => [
        student.regNo,
        student.name,
        student.rollNo,
          student.cgpa ?? '-'
        ]);
        allData = [...headerRows, ...rows];
        ws = XLSX.utils.aoa_to_sheet(allData);
        ws['!cols'] = [
          { wch: 15 }, // Register No
          { wch: 25 }, // Name
          { wch: 12 }, // Roll No
          { wch: 8 }   // CGPA
        ];
      } else {
        // ... existing semester export code ...
        const batch = user['Batch '] || user.Batch || '';
        const section = user['Section '] || user.Section || '';
        const headerData = [
          ['Velammal College of Engineering and Technology, Madurai'],
          ['Department of Computer Science and Engineering'],
          [`Semester ${selectedSemester} - OVERALL RESULT ANALYSIS`],
          [`Date: ${new Date().toLocaleDateString('en-IN')}`],
          [`Year/Semester/Section: ${batch}/${selectedSemester}/${section}`],
          [],
          ['Register No', 'Name', 'Roll No', ...courseData[selectedSemester].map(c => c.code), 'GPA']
        ];
        const studentRows = filteredStudents.map(student => [
          student.regNo,
          student.name,
          student.rollNo,
          ...courseData[selectedSemester].map(course =>
            student.semesters?.[selectedSemester]?.marks?.[course.code] || '-'
          ),
          student.semesters?.[selectedSemester]?.gpa || '-'
        ]);
        allData = [...headerData, ...studentRows];
        ws = XLSX.utils.aoa_to_sheet(allData);
      }
      XLSX.utils.book_append_sheet(wb, ws, selectedSemester ? 'Semester Results' : 'CGPA');
      const fileName = selectedSemester
        ? `Semester_${selectedSemester}_Results_${new Date().toISOString().split('T')[0]}.xlsx`
        : `CGPA_Results_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      setSuccess('Excel file exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export Excel file');
    }
  };

  // Export as PDF (support CGPA export if no semester selected)
  const exportToPDF = () => {
    if (!studentsData.length) {
      setError('No data to export');
      return;
    }
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      if (!selectedSemester) {
        // Export CGPA table
        doc.setFontSize(16);
        doc.text('Velammal College of Engineering and Technology, Madurai', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(14);
        doc.text('Department of Computer Science and Engineering', pageWidth / 2, 25, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 15, 35);
        const headers = ['Register No', 'Name', 'Roll No', 'CGPA'];
        const data = filteredStudents.map(student => [
        student.regNo,
        student.name,
        student.rollNo,
          student.cgpa ?? '-'
        ]);
        autoTable(doc, {
          startY: 45,
          head: [headers],
          body: data,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, halign: 'center', valign: 'middle' },
          headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
        });
      } else {
        // ... existing semester PDF export code ...
        // (leave as is)
      }
      const fileName = selectedSemester
        ? `Semester_${selectedSemester}_Results_${new Date().toISOString().split('T')[0]}.pdf`
        : `CGPA_Results_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      setSuccess('PDF file exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export PDF file: ' + error.message);
    }
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim());
      const markRows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      // Map CSV to studentsData
      const updatedStudents = studentsData.map(student => {
        // Always compare as string, remove quotes
        const row = markRows.find(r => r[0].replace(/^'+|'+$/g, '') === String(student.regNo));
        if (!row) return student;
        const marks = {};
        courseData[selectedSemester].forEach((course, idx) => {
          const cell = row[3 + idx];
          if (cell && cell.trim() !== '') {
            marks[course.code] = cell.trim();
          }
          // If cell is empty, do NOT add the property to marks
        });
        // GPA is last column, but recalculate for accuracy
        const gpa = calculateGPA(marks);
        return {
          ...student,
          semesters: {
            ...student.semesters,
            [selectedSemester]: {
              marks,
              gpa
            }
          }
        };
      });
      setStudentsData(updatedStudents);
      setSuccess('CSV loaded. Please review and click Save Changes.');
    };
    reader.readAsText(file);
  };

  // Add save marks function
  const handleSaveMarks = async () => {
    if (!selectedSemester) {
      setError('Please select a semester first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for backend in the correct structure
      const studentsToSave = studentsData.map(student => {
        // Ensure marks is an object and calculate GPA
        const currentMarks = student.semesters?.[selectedSemester]?.marks || {};
        const gpa = calculateGPA(currentMarks);
        
        // Create or update the semester data
        const updatedSemesters = {
          ...student.semesters,
          [selectedSemester]: {
            marks: currentMarks,
            gpa: gpa
          }
        };

        return {
          regNo: student.regNo,
          rollNo: student.rollNo,
          semesters: updatedSemesters
        };
      });

      // Send update request
      const response = await fetch('http://localhost:5000/api/marks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: studentsToSave
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(data.message || 'Marks saved successfully');
        setIsEditing(false);
        // Refresh data after save
        await fetchStudentsData();
      } else {
        throw new Error(data.error || 'Failed to save marks');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Network error while saving marks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSVTemplate = () => {
    if (!selectedSemester) {
      setError('Please select a semester first');
      return;
    }
    const headers = ['Register No', 'Name', 'Roll No', ...courseData[selectedSemester].map(c => c.code), 'GPA'];
    const rows = studentsData.map(student => [
      `'${student.regNo}`,
      student.name,
      student.rollNo,
      ...courseData[selectedSemester].map(() => ''),
      '' // GPA column
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Semester_${selectedSemester}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
  <Layout>
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Semester Marks</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                sx={{ bgcolor: 'primary.main' }}
              >
                Edit Marks
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveMarks}
                disabled={!isEditing || isLoading}
                sx={{ bgcolor: 'success.main' }}
              >
                {isLoading ? 'Saving...' : 'Save Marks'}
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
              <Tab label="MARKS EDITOR" />
              <Tab label="EXCEL UPLOAD" />
            </Tabs>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={4} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                onClick={exportToPDF}
                sx={{ bgcolor: 'primary.main' }}
              >
                Export as PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportToExcel}
                sx={{ bgcolor: 'primary.main' }}
              >
                Export as Excel
              </Button>
            </Stack>
          </Box>

          {selectedTab === 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Semester</InputLabel>
                    <Select
                      value={selectedSemester}
                      label="Select Semester"
                      onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                      <MenuItem value="">Select Semester</MenuItem>
                      {Object.entries(numberToSemester).map(([value, label]) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TextField
                      placeholder="Filter by Register No, Name, or Roll No"
                      value={registerNoFilter}
                      onChange={e => setRegisterNoFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <IconButton size="small">
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {selectedSemester ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Register No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Roll No</TableCell>
                        {courseData[selectedSemester]?.map(course => (
                          <TableCell key={course.code} align="center">
                            {course.code}<br/>({course.shortForm})
                          </TableCell>
                        ))}
                        <TableCell align="center">GPA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={(courseData[selectedSemester]?.length || 0) + 4} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={(courseData[selectedSemester]?.length || 0) + 4} align="center">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student.regNo} hover>
                            <TableCell>{student.regNo}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            {courseData[selectedSemester]?.map(course => {
                              const mark = student.semesters?.[selectedSemester]?.marks?.[course.code];
                              return (
                              <TableCell key={course.code} align="center">
                                {isEditing ? (
                                  <Select
                                      value={mark !== undefined && mark !== null ? mark : ''}
                                    onChange={e => {
                                      const value = e.target.value;
                                      setStudentsData(prev => prev.map(s => {
                                        if (s.regNo === student.regNo) {
                                          // Create new marks object with the updated grade
                                          const updatedMarks = {
                                            ...(s.semesters?.[selectedSemester]?.marks || {}),
                                            [course.code]: value
                                          };
                                          
                                          // Calculate GPA immediately
                                          let totalCredits = 0;
                                          let totalGradePoints = 0;
                                          courseData[selectedSemester].forEach(c => {
                                            const grade = updatedMarks[c.code];
                                            if (grade && gradePoints[grade] !== undefined) {
                                              totalCredits += c.credits;
                                              totalGradePoints += gradePoints[grade] * c.credits;
                                            }
                                          });
                                          
                                          const calculatedGpa = totalCredits > 0 ? 
                                            (totalGradePoints / totalCredits).toFixed(2) : 
                                            "0";

                                          return {
                                            ...s,
                                            semesters: {
                                              ...s.semesters,
                                              [selectedSemester]: {
                                                ...s.semesters?.[selectedSemester],
                                                marks: updatedMarks,
                                                gpa: calculatedGpa
                                              }
                                            }
                                          };
                                        }
                                        return s;
                                      }));
                                    }}
                                    displayEmpty
                                    size="small"
                                    sx={{ minWidth: 60 }}
                                  >
                                    <MenuItem value=""><em>-</em></MenuItem>
                                    {gradeOptions.map(grade => (
                                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                    ))}
                                  </Select>
                                ) : (
                                    (mark && mark.trim() !== "") ? mark : "-"
                                )}
                              </TableCell>
                              );
                            })}
                            <TableCell align="center">
                              {student.semesters?.[selectedSemester]?.gpa && 
                               student.semesters?.[selectedSemester]?.gpa !== "0" ? 
                               student.semesters?.[selectedSemester]?.gpa : 
                               "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Register No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Roll No</TableCell>
                        <TableCell>CGPA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map(student => (
                          <TableRow key={student.regNo}>
                            <TableCell>{student.regNo}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell>{student.cgpa ?? '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                CSV Upload Instructions
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                1. Select a semester and download the template.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                2. Fill in the marks using these grades: O, A+, A, B+, B, C, U, RA, SA, W
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                3. Save the file as <b>CSV</b> (not XLSX).
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                4. Upload the CSV file below.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                5. Review the marks in the UI and click <b>Save Changes</b> to save to the database.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={downloadCSVTemplate}
                  disabled={!selectedSemester}
                  sx={{ mr: 2 }}
                >
                  Download Template
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  disabled={!selectedSemester}
                >
                  Upload CSV File
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleCSVUpload}
                  />
                </Button>
              </Box>
            </Box>
          )}

          {selectedSemester && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Grade Counts
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>O</TableCell>
                      <TableCell>A+</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell>B+</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>C</TableCell>
                      <TableCell>U</TableCell>
                      <TableCell>RA</TableCell>
                      <TableCell>SA</TableCell>
                      <TableCell>W</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseData[selectedSemester].map(subject => (
                      <TableRow key={subject.code}>
                        <TableCell>{subject.code}</TableCell>
                        {Object.values(gradeCounts[subject.code] || {}).map((count, grade) => (
                          <TableCell key={`${subject.code}-${grade}`}>{count}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
    </Paper>
      </Box>
  </Layout>
);
};

export default SemesterMarks; 