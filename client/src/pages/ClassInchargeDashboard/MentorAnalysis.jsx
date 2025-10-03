import React, { useEffect, useState, useRef } from 'react';
import Layout from './Layout';
import { Typography, Paper, Box, CircularProgress, Card, CardContent, Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import domtoimage from 'dom-to-image';

const MentorAnalysis = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [mentorStats, setMentorStats] = useState([]); // [{mentorId, students, totalStudents, mentorDetails}]
  const [loading, setLoading] = useState(true);
  const chartRefs = useRef({});
  const mentorCardRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const batch = user['Batch '] || user.Batch;
      const section = user['Section '] || user.Section;
      // 1. Fetch all students
      const stuRes = await fetch(`http://localhost:5000/api/students/classincharge?batchId=${batch}&sectionId=${section}`);
      const stuData = await stuRes.json();
      // 2. Fetch all marks
      const marksRes = await fetch('http://localhost:5000/api/marks/all');
      const marksData = await marksRes.json();
      // 3. Merge marks into students
      const marksMap = {};
      (marksData.students || []).forEach(m => { marksMap[m.regNo] = m; });
      const merged = (stuData.students || []).map(s => ({
        ...s,
        cgpa: marksMap[s.Register]?.cgpa || 0,
        semesters: marksMap[s.Register]?.semesters || {}
      }));
      setStudents(merged);
      // 4. Mentorwise grouping
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
      setLoading(false);
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <Layout><Box sx={{ p: 4 }}><CircularProgress /></Box></Layout>;

  // Helper: get CGPA distribution for a mentor's students
  const getCgpaDistribution = (students) => {
    const bins = [
      { range: '6-7', count: 0 },
      { range: '7-8', count: 0 },
      { range: '8-9', count: 0 },
      { range: '9-10', count: 0 },
    ];
    students.forEach(s => {
      const cgpa = Number(s.cgpa) || 0;
      if (cgpa >= 6 && cgpa < 7) bins[0].count++;
      else if (cgpa >= 7 && cgpa < 8) bins[1].count++;
      else if (cgpa >= 8 && cgpa < 9) bins[2].count++;
      else if (cgpa >= 9 && cgpa <= 10) bins[3].count++;
    });
    return bins;
  };

  return (
  <Layout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4B006E', fontWeight: 600 }}>
          Mentor-wise Analysis
        </Typography>
        {mentorStats.length === 0 && (
          <Typography sx={{ mt: 4 }}>No mentor data found for this class.</Typography>
        )}
        <Grid container spacing={4} direction="column">
          {mentorStats.map(m => m.mentorDetails && (
            <Grid item xs={12} key={m.mentorId}>
              <Card ref={el => mentorCardRefs.current[m.mentorId] = el} sx={{ mb: 4, borderLeft: '6px solid #4B006E', borderRadius: 3, boxShadow: 3, background: '#f3eaff' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar sx={{ bgcolor: '#4B006E', width: 56, height: 56 }}>{m.mentorDetails.Name?.[0]}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{m.mentorDetails.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">{m.mentorDetails.Dept}</Typography>
                      <Typography variant="body2">Staff ID: <b>{m.mentorDetails.StaffId}</b></Typography>
                      <Typography variant="body2">Email: {m.mentorDetails.EmailId}</Typography>
                      <Typography variant="body2">Mobile: {m.mentorDetails['Mobile No']}</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>Students</Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Roll No</TableCell>
                          <TableCell>Register No</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>CGPA</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(students.filter(s => s.Mentor === m.mentorId) || []).map(s => (
                          <TableRow key={s._id}>
                            <TableCell>{s.Roll}</TableCell>
                            <TableCell>{s.Register}</TableCell>
                            <TableCell>{s.Name}</TableCell>
                            <TableCell>{s['E-mail']}</TableCell>
                            <TableCell>{Number(s.cgpa) ? Number(s.cgpa).toFixed(2) : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* CGPA Stats and Distribution */}
                  {(() => {
                    const mentorStudents = students.filter(s => s.Mentor === m.mentorId);
                    const cgpas = (mentorStudents || []).map(s => Number(s.cgpa) || 0).filter(Boolean);
                    const avg = cgpas.length ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : '-';
                    const high = cgpas.length ? Math.max(...cgpas) : '-';
                    const low = cgpas.length ? Math.min(...cgpas) : '-';
                    const dist = getCgpaDistribution(mentorStudents || []);
                    return (
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          CGPA Analysis
                        </Typography>
                        <Stack direction="row" spacing={3} mb={1}>
                          <Typography variant="body2">Total Students: <b>{(mentorStudents || []).length}</b></Typography>
                          <Typography variant="body2">6-7: <b>{dist[0].count}</b></Typography>
                          <Typography variant="body2">7-8: <b>{dist[1].count}</b></Typography>
                          <Typography variant="body2">8-9: <b>{dist[2].count}</b></Typography>
                          <Typography variant="body2">9-10: <b>{dist[3].count}</b></Typography>
                        </Stack>
                        <Stack direction="row" spacing={3} mb={1}>
                          <Typography variant="body2">Average CGPA: <b>{avg}</b></Typography>
                          <Typography variant="body2">Highest CGPA: <b>{high}</b></Typography>
                          <Typography variant="body2">Lowest CGPA: <b>{low}</b></Typography>
                        </Stack>
                        <Box sx={{ width: '100%', height: 250, background: '#fffde7', borderRadius: 2, p: 2 }} ref={el => chartRefs.current[m.mentorId] = el}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>CGPA Distribution</Typography>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={dist}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" label={{ value: 'CGPA Range', position: 'insideBottom', offset: -5 }} />
                              <YAxis allowDecimals={false} label={{ value: 'No. of Students', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#4B006E" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Box>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
  </Layout>
);
};

export default MentorAnalysis; 