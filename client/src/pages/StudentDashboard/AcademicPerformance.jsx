import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AcademicPerformance = () => {
  const { user } = useAuth();
  const [semesters, setSemesters] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/semesterMarks/match/student/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.student) {
          setCgpa(data.student.cgpa || null);
          const semArr = Object.entries(data.student.semesters || {}).map(([sem, val]) => ({
            sem,
            marks: val.marks,
            gpa: val.gpa
          })).sort((a, b) => parseInt(a.sem) - parseInt(b.sem));
          setSemesters(semArr);
        } else {
          setError('No academic performance data found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch academic performance data.');
        setLoading(false);
      });
  }, [user]);

  // Prepare data for the chart
  const chartData = semesters.map(sem => ({
    name: `Sem ${sem.sem}`,
    gpa: Number(sem.gpa)
  }));

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)', color: '#2D264B', p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>Academic Performance</Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography fontWeight={600} fontSize={18} mb={2}>
                CGPA: {cgpa !== null ? cgpa : 'Not available'}
              </Typography>
              {/* GPA Tracking Graph */}
              {semesters.length > 0 && (
                <Box mb={4}>
                  <Typography fontWeight={600} fontSize={16} mb={1} color="#5B2A86">
                    GPA Tracking Graph
                  </Typography>
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
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AcademicPerformance; 