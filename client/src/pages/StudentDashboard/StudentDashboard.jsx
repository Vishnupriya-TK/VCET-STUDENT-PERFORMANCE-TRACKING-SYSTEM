import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import StudentDashboardLayout from './Layout';
import { Outlet, useLocation } from 'react-router-dom';

// Helper to determine year from batch (e.g., 2022-2026)
function getYearFromBatch(batchStr) {
  if (!batchStr) return '-';
  const match = batchStr.match(/(\d{4})-(\d{4})/);
  if (!match) return '-';
  const start = parseInt(match[1], 10);
  const now = new Date();
  const currentYear = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  const diff = currentYear - start;
  if (diff === 0) return 'I';
  if (diff === 1) return 'II';
  if (diff === 2) return 'III';
  if (diff === 3) return 'IV';
  return '-';
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [classIncharge, setClassIncharge] = useState(null);
  const location = useLocation();

  const batch = user?.['Batch '] || user?.Batch;
  const section = user?.['Section '] || user?.Section;
  const department = user?.Department || user?.Dept;
  const year = getYearFromBatch(batch);

  useEffect(() => {
    // Fetch Mentor Details by StaffId
    if (user?.Mentor) {
      fetch('http://localhost:5000/api/staffs/' + user.Mentor)
        .then(res => res.json())
        .then(data => {
          console.log('Mentor fetch result:', data);
          if (data.success) setMentor(data.staff);
        });
    }
    // Fetch Class Incharge Details by StaffId if available
    if (user?.ClassIncharge && user.ClassIncharge !== 'NO') {
      fetch('http://localhost:5000/api/staffs/' + user.ClassIncharge)
        .then(res => res.json())
        .then(data => {
          console.log('Class Incharge fetch by StaffId result:', data);
          if (data.success) setClassIncharge(data.staff);
        });
    } else if (batch && section && department) {
      // Fallback: Fetch Class Incharge Details by batch, section, department
      console.log('ClassIncharge query:', {
        ClassIncharge: "YES",
        "Batch ": batch,
        "Section ": section,
        Dept: department
      });
      fetch(`http://localhost:5000/api/staffs/classincharge?batch=${batch}&section=${section}&dept=${department}`)
        .then(res => res.json())
        .then(data => {
          console.log('Class Incharge API result:', data);
          if (data.success && data.staff) setClassIncharge(data.staff);
        });
    }
  }, [user, batch, section, department]);

  // Debug logs for state
  console.log('classIncharge state:', classIncharge);
  console.log('mentor state:', mentor);

  return (
    <StudentDashboardLayout>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome{user?.Name ? `, ${user.Name}` : ''}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here is your class and academic information.
        </Typography>
      </Box>
      {location.pathname === '/dashboard/student' && (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(90deg, #B19CD9 0%, #D4C6E6 100%)', color: '#2D264B' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Class Details</Typography>
              <Typography>Batch: {batch || '-'}</Typography>
              <Typography>Year: {year || '-'}</Typography>
              <Typography>Section: {section || '-'}</Typography>
              <Typography>Department: {department || '-'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(90deg, #D4C6E6 0%, #B19CD9 100%)', color: '#2D264B' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Mentor</Typography>
              <Typography>Name: {mentor?.Name || '-'}</Typography>
              <Typography>ID: {mentor?.StaffId || '-'}</Typography>
              <Typography>Contact: {mentor?.['Mobile No'] || '-'}</Typography>
              <Typography>Email: {mentor?.EmailId || '-'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        </Grid>
      )}
      <Outlet />
    </StudentDashboardLayout>
  );
};

export default StudentDashboard; 