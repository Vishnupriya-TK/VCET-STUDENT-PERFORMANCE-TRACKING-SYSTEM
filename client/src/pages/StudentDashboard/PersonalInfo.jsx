import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Fade } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const excludedFields = ['_id', '__v', 'Mentor'];

const customLabels = {
  'Roll': 'Roll Number',
  'Register': 'Register Number',
  'E-Mail': 'Email ID',
  'Mentor': 'Mentor ID',
};

const formatKey = (key) => {
  if (customLabels[key]) return customLabels[key];
  return key.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
};

const urlFields = [
  'Portfolio',
  'Resume',
  'LinkedIn',
  'GitHub',
  'HackerRank',
  'LeetCode',
  'HackerEarth',
  'Skillrack',
  'GeeksforGeeks',
];

const PersonalInfo = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    fetch(`/api/students/${user._id}`)
      .then(res => res.json())
      .then(data => {
        console.log('[PersonalInfo] Fetched data:', data); // Debug log
        if (data.success && data.student) setStudent(data.student);
        if (data.success && data.portfolio) setPortfolio(data.portfolio);
        setLoading(false);
        // Fetch mentor info if Mentor ID exists
        if (data.success && data.student && data.student.Mentor) {
          fetch(`/api/staffs/${data.student.Mentor}`)
            .then(res => res.json())
            .then(staffData => {
              if (staffData.success && staffData.staff) setMentor(staffData.staff);
            });
        }
      });
  }, [user]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!student || Object.keys(student).length === 0) return <Typography>No student data found. Please contact admin.</Typography>;

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      {/* Campus Identity Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)',
          color: '#2D264B',
          p: { xs: 2, sm: 4 },
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Campus Identity</Typography>
          <Grid container spacing={2}>
            {Object.entries(student)
              .filter(([key]) => !excludedFields.includes(key) && key.toLowerCase() !== 'domains' && key.toLowerCase() !== 'projects')
              .map(([key, value], idx) => (
                <Fade in={true} style={{ transitionDelay: `${idx * 40}ms` }} key={key}>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500} color="#5B2A86" fontSize={14} mb={0.5} letterSpacing={0.2}>
                      {formatKey(key)}
                    </Typography>
                    <Typography fontSize={16} fontWeight={400} sx={{ wordBreak: 'break-word', color: '#2D264B' }}>
                      {value ? String(value) : 'Not provided'}
                    </Typography>
                  </Grid>
                </Fade>
              ))}
            {/* Show Mentor ID explicitly if present */}
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
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
            background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)',
            color: '#2D264B',
            p: { xs: 2, sm: 4 },
            mb: 4,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Techfolio</Typography>
            <Grid container spacing={2}>
              {[
                'placementEmail',
                'Portfolio',
                'Resume',
                'GitHub',
                'LinkedIn',
                'LeetCode',
                'Skillrack',
                'GeeksforGeeks',
                'HackerRank',
                'HackerEarth',
              ].map((key, idx) => (
                portfolio[key] ? (
                  <Fade in={true} style={{ transitionDelay: `${idx * 40}ms` }} key={key}>
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={500} color="#5B2A86" fontSize={14} mb={0.5} letterSpacing={0.2}>
                        {formatKey(key)}
                      </Typography>
                      <Typography fontSize={16} fontWeight={400} sx={{ wordBreak: 'break-word', color: '#2D264B' }}>
                        <a href={portfolio[key]} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: 'underline', wordBreak: 'break-all' }}>{portfolio[key]}</a>
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
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d7fe 100%)',
            color: '#2D264B',
            p: { xs: 2, sm: 4 },
            mb: 4,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Interested Domains</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {portfolio.domains.map((domain, idx) => (
                <Box key={idx} sx={{
                  background: '#ede9fe',
                  color: '#5B2A86',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: '0 1px 4px 0 rgba(31, 38, 135, 0.06)',
                }}>{domain}</Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Projects Card */}
      {portfolio && Array.isArray(portfolio.projects) && portfolio.projects.length > 0 && (
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
            background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)',
            color: '#2D264B',
            p: { xs: 2, sm: 4 },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="#5B2A86">Projects</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {portfolio.projects.map((project, idx) => (
                <Box key={project._id || idx} sx={{ mb: 1, background: '#ede9fe', borderRadius: 2, p: 2 }}>
                  <Typography fontWeight={600} color="#5B2A86" fontSize={15} mb={0.5}>Link</Typography>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.palette.primary.main, textDecoration: 'underline', wordBreak: 'break-all', fontSize: 15 }}
                  >
                    {project.link}
                  </a>
                  {project.description && (
                    <>
                      <Typography fontWeight={600} color="#5B2A86" fontSize={15} mt={1} mb={0.5}>Description</Typography>
                      <Typography fontSize={15} fontWeight={400} sx={{ color: '#2D264B', whiteSpace: 'pre-line' }}>{project.description}</Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PersonalInfo;