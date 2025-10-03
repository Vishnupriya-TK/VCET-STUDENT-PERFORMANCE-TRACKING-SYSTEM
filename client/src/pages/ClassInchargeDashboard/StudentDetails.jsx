import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { Box, Typography, Button, Link, CircularProgress, Grid, Card, CardContent, Stack, MenuItem, Select, FormControl, InputLabel, Fade, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { TableRow, TableCell } from '@mui/material';

const gradePoints = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0, RA: 0, SA: 0, W: 0 };

const InfoRow = ({ label, value }) => (
  <Box display="flex" mb={1}>
    <Typography fontWeight={600} sx={{ minWidth: 140 }}>{label}:</Typography>
    <Typography>{value || '-'}</Typography>
  </Box>
);

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch student and portfolio
        const res = await fetch(`/api/students/${id}`);
        const data = await res.json();
        if (data.success) {
          setStudent(data.student);
          setPortfolio(data.portfolio);
        } else {
          setError('Student not found');
        }
        // Fetch marks
        const marksRes = await fetch(`/api/semesterMarks/match/student/${id}`);
        const marksData = await marksRes.json();
        if (marksData.success) {
          setMarks(marksData.student);
        }
      } catch (err) {
        setError('Error fetching data');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <Layout><Box sx={{ p: 4 }}><CircularProgress /></Box></Layout>;
  if (error || !student) return <Layout><Box sx={{ p: 4 }}><Typography color="error">{error || 'No data found.'}</Typography></Box></Layout>;

  // --- Personal Info Card ---
  const excludedFields = ['_id', '__v', 'Mentor'];
  const customLabels = {
    'Roll': 'Roll Number',
    'Register': 'Register Number',
    'E-mail': 'E-Mail',
    'Mentor': 'Mentor ID',
  };
  const formatKey = (key) => customLabels[key] || key.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());

  // --- Academic Performance ---
  const semesters = marks && marks.semesters
    ? Object.entries(marks.semesters)
        .map(([sem, val]) => ({ sem, marks: val.marks, gpa: val.gpa }))
        .sort((a, b) => parseInt(a.sem) - parseInt(b.sem))
    : [];
  const cgpa = marks && marks.cgpa !== undefined ? marks.cgpa : null;
  const chartData = semesters.map(sem => ({ name: `Sem ${sem.sem}`, gpa: Number(sem.gpa) }));

  return (
    <Layout>
      <Box maxWidth={900} mx="auto" mt={3}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, color: 'black' }}>Back</Button>
        {/* Campus Identity Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3, mb: 4 }}>
              <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Campus Identity</Typography>
            <Grid container spacing={2}>
              {Object.entries(student)
                .filter(([key]) => !excludedFields.includes(key) && key.toLowerCase() !== 'domains' && key.toLowerCase() !== 'projects')
                .map(([key, value], idx) => (
                  <Fade in={true} style={{ transitionDelay: `${idx * 40}ms` }} key={key}>
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={500} color="#5B2A86" fontSize={14} mb={0.5} letterSpacing={0.2}>{formatKey(key)}</Typography>
                      <Typography fontSize={16} fontWeight={400} sx={{ wordBreak: 'break-word', color: '#2D264B' }}>{value ? String(value) : 'Not provided'}</Typography>
                    </Grid>
                  </Fade>
                ))}
              {student.Mentor && (
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={500} color="#5B2A86" fontSize={14} mb={0.5} letterSpacing={0.2}>Mentor ID</Typography>
                  <Typography fontSize={16} fontWeight={400} sx={{ wordBreak: 'break-word', color: '#2D264B' }}>{student.Mentor}</Typography>
          </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        {/* Techfolio Card */}
        {portfolio && (
          <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)', color: '#2D264B', p: 3, mb: 4 }}>
              <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Techfolio</Typography>
              <Grid container spacing={2}>
                {['placementEmail','Portfolio','Resume','GitHub','LinkedIn','LeetCode','Skillrack','GeeksforGeeks','HackerRank','HackerEarth'].map((key, idx) => (
                  portfolio[key] ? (
                    <Fade in={true} style={{ transitionDelay: `${idx * 40}ms` }} key={key}>
                      <Grid item xs={12} sm={6}>
                        <Typography fontWeight={500} color="#5B2A86" fontSize={14} mb={0.5} letterSpacing={0.2}>{formatKey(key)}</Typography>
                        <Typography fontSize={16} fontWeight={400} sx={{ wordBreak: 'break-word', color: '#2D264B' }}>
                          <a href={portfolio[key]} target="_blank" rel="noopener noreferrer" style={{ color: '#7c4dff', textDecoration: 'underline', wordBreak: 'break-all' }}>{portfolio[key]}</a>
                        </Typography>
                      </Grid>
                    </Fade>
                  ) : null
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
        {/* Interested Domains Card */}
        {portfolio && Array.isArray(portfolio.domains) && portfolio.domains.length > 0 && (
          <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3, mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Interested Domains</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {portfolio.domains.map((domain, idx) => (
                  <Box key={idx} sx={{ background: '#ede9fe', color: '#5B2A86', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500, fontSize: 14, boxShadow: '0 1px 4px 0 rgba(31, 38, 135, 0.06)' }}>{domain}</Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
        {/* Projects Card */}
        {portfolio && Array.isArray(portfolio.projects) && portfolio.projects.length > 0 && (
          <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)', color: '#2D264B', p: 3, mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Projects</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {portfolio.projects.map((project, idx) => (
                  <Box key={project._id || idx} sx={{ mb: 1, background: '#ede9fe', borderRadius: 2, p: 2 }}>
                    <Typography fontWeight={600} color="#5B2A86" fontSize={15} mb={0.5}>Link</Typography>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#7c4dff', textDecoration: 'underline', wordBreak: 'break-all' }}>{project.link}</a>
                    <Typography fontWeight={600} color="#5B2A86" fontSize={15} mt={1} mb={0.5}>Description</Typography>
                    <Typography fontSize={15} sx={{ color: '#2D264B', whiteSpace: 'pre-line' }}>{project.description}</Typography>
                  </Box>
                ))}
              </Box>
              </CardContent>
            </Card>
        )}
        {/* Academic Performance Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3, mb: 4 }}>
              <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>Academic Performance</Typography>
            <Typography fontWeight={600} fontSize={18} mb={2}>CGPA: {cgpa !== null ? cgpa : 'Not available'}</Typography>
            {/* GPA Tracking Graph */}
            {semesters.length > 0 && (
              <Box mb={4}>
                <Typography fontWeight={600} fontSize={16} mb={1} color="#5B2A86">GPA Tracking Graph</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1d7fa" />
                    <XAxis dataKey="name" stroke="#5B2A86" fontSize={13} />
                    <YAxis domain={[0, 10]} stroke="#5B2A86" fontSize={13} />
                    <Tooltip formatter={(value) => value?.toFixed(2)} />
                    <Line type="monotone" dataKey="gpa" stroke="#7c4dff" strokeWidth={3} dot={{ r: 5, fill: '#ffd600', stroke: '#7c4dff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
            )}
            {semesters.length === 0 && <Typography>No semester data found.</Typography>}
            {semesters.map((sem) => (
              <Paper key={sem.sem} sx={{ p: 2, mb: 3, background: '#ede9fe' }}>
                <Typography fontWeight={600} fontSize={16} mb={1}>Semester {sem.sem}</Typography>
                <Grid container spacing={1}>
                  {sem.marks && Object.entries(sem.marks).map(([code, grade]) => (
                    <Grid item xs={12} sm={6} key={code}>
                      <Typography fontWeight={500} color="#5B2A86" fontSize={14}>{code}: <span style={{ color: '#2D264B' }}>{grade}</span></Typography>
                    </Grid>
                  ))}
                </Grid>
                <Typography mt={1} fontWeight={500} color="#2D264B">GPA: {sem.gpa}</Typography>
              </Paper>
            ))}
              </CardContent>
            </Card>
      </Box>
    </Layout>
  );
};

export default StudentDetails; 