import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { Typography, Box, Grid, Card, CardContent, Avatar, Stack, CircularProgress, Paper } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../contexts/AuthContext';

const MentorCard = ({ mentor, studentCount }) => (
  <Card sx={{ minWidth: 260, borderLeft: '6px solid #4B006E', borderRadius: 3, boxShadow: 3, background: '#f3eaff' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Avatar sx={{ bgcolor: '#4B006E', width: 48, height: 48 }}>{mentor.Name?.[0]}</Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>{mentor.Name}</Typography>
          <Typography variant="body2" color="text.secondary">{mentor.Dept}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <BadgeIcon sx={{ color: '#7C1FA0' }} />
        <Typography variant="body2">Staff ID: <b>{mentor.StaffId}</b></Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <EmailIcon sx={{ color: '#1976d2' }} />
        <Typography variant="body2">{mentor.EmailId}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <PhoneIcon sx={{ color: '#388e3c' }} />
        <Typography variant="body2">{mentor['Mobile No']}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <PeopleIcon sx={{ color: '#FFD600' }} />
        <Typography variant="body2">Students: <b>{studentCount}</b></Typography>
      </Stack>
    </CardContent>
  </Card>
);

const Home = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [mentorStats, setMentorStats] = useState([]); // [{mentorId, students, totalStudents, mentorDetails}]
  const [mentorsMap, setMentorsMap] = useState({}); // mentorId -> mentorDetails
  const [loading, setLoading] = useState(true);
  const [cgpaStats, setCgpaStats] = useState({ avg: '-', high: '-', low: '-' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const batch = user['Batch '] || user.Batch;
      const section = user['Section '] || user.Section;

      // 1. Fetch all students for this class
      const stuRes = await fetch(`http://localhost:5000/api/students/classincharge?batchId=${batch}&sectionId=${section}`);
      const stuData = await stuRes.json();

      // 2. Fetch all marks
      const marksRes = await fetch('http://localhost:5000/api/marks/all');
      const marksData = await marksRes.json();

      // 3. Merge marks into students (like AcademicPerformance)
      const marksMap = {};
      (marksData.students || []).forEach(m => { marksMap[m.regNo] = m; });
      const merged = (stuData.students || []).map(s => ({
        ...s,
        cgpa: marksMap[s.Register]?.cgpa || 0,
        semesters: marksMap[s.Register]?.semesters || {}
      }));
      setStudents(merged);

      // 4. Mentorwise grouping (same as before)
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

      // 5. CGPA stats from merged data
      const cgpas = merged.map(s => Number(s.cgpa) || 0).filter(Boolean);
      const avg = cgpas.length ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : '-';
      const high = cgpas.length ? Math.max(...cgpas) : '-';
      const low = cgpas.length ? Math.min(...cgpas) : '-';
      setCgpaStats({ avg, high, low });

      setLoading(false);
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <Layout><Box sx={{ p: 4 }}><CircularProgress /></Box></Layout>;

  return (
  <Layout>
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#4B006E', fontWeight: 600 }}>
        Class Incharge Dashboard
      </Typography>
        {/* First row: Total Students, Mentors */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, background: '#f3eaff', borderLeft: '6px solid #FFD600' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <SchoolIcon sx={{ color: '#FFD600', fontSize: 36 }} />
                <Box>
                  <Typography variant="h6">Total Students</Typography>
                  <Typography variant="h5" fontWeight={700}>{students.length}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 2, background: '#f3eaff', borderLeft: '6px solid #4B006E' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GroupIcon sx={{ color: '#4B006E', fontSize: 36 }} />
                <Box>
                  <Typography variant="h6">Mentors</Typography>
                  <Typography variant="h5" fontWeight={700}>{mentorStats.length}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        {/* Second row: CGPA stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} md={2}>
            <Paper elevation={3} sx={{ p: 2, background: '#f3eaff', borderLeft: '6px solid #1976d2' }}>
              <Typography variant="subtitle2">Avg CGPA</Typography>
              <Typography variant="h5" fontWeight={700}>{cgpaStats.avg}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Paper elevation={3} sx={{ p: 2, background: '#f3eaff', borderLeft: '6px solid #388e3c' }}>
              <Typography variant="subtitle2">Highest CGPA</Typography>
              <Typography variant="h5" fontWeight={700}>{cgpaStats.high}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Paper elevation={3} sx={{ p: 2, background: '#f3eaff', borderLeft: '6px solid #FF6384' }}>
              <Typography variant="subtitle2">Lowest CGPA</Typography>
              <Typography variant="h5" fontWeight={700}>{cgpaStats.low}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography variant="h5" sx={{ color: '#4B006E', fontWeight: 600, mb: 2 }}>Mentor Details</Typography>
        <Grid container spacing={3} direction="column">
          {mentorStats.map(m => m.mentorDetails && (
            <Grid item xs={12} key={m.mentorId}>
              <MentorCard mentor={m.mentorDetails} studentCount={m.totalStudents} />
            </Grid>
          ))}
        </Grid>
    </Box>
  </Layout>
);
};

export default Home; 