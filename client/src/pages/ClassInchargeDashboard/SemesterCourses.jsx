import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import Layout from './Layout';

const SEMESTERS = ['01','02','03','04','05','06','07','08'];

const coursesData = {
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

const SemesterCourses = ({ departmentId }) => {
  const [semester, setSemester] = useState('01');
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>Semester Courses</Typography>
      <Paper sx={{ p: 3 }}>
        <Tabs value={semester} onChange={(_, v) => setSemester(v)}>
          {SEMESTERS.map(s => (
            <Tab key={s} value={s} label={`Semester ${s}`} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Courses for Semester {semester}</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Short Form</TableCell>
                  <TableCell>Credits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coursesData[semester]?.map(course => (
                  <TableRow key={course.code}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.shortForm}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Layout>
  );
};

export default SemesterCourses;