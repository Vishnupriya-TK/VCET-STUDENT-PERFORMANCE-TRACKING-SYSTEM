import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Paper, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const StudentList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/students/classincharge?batchId=${user.Batch}&sectionId=${user.Section}`);
        const data = await res.json();
        if (data.success) setStudents(data.students);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>Student List</Typography>
      <TableContainer component={Paper} sx={{ background: 'linear-gradient(115deg,rgb(213, 180, 255),rgb(213, 226, 255),rgb(203, 167, 249))' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Register No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Student Mobile No</TableCell>
              <TableCell>Parent Mobile No</TableCell>
              <TableCell>Mentor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.Roll}</TableCell>
                <TableCell>{student.Register}</TableCell>
                <TableCell>{student.Name}</TableCell>
                <TableCell>{student["E-mail"]}</TableCell>
                <TableCell>{student["Student Mobile No"] || 'N/A'}</TableCell>
                <TableCell>{student["Parents Mobile No "] || 'N/A'}</TableCell>
                <TableCell>{student.Mentor}</TableCell>
                <TableCell>{student.Department}</TableCell>
                <TableCell>{student["Batch "]}</TableCell>
                <TableCell>{student["Section "]}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/dashboard/class-incharge/students/${student._id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default StudentList; 