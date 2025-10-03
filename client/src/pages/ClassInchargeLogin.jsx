import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';
import HomeIcon from '@mui/icons-material/Home';
import LoginCard from '../components/LoginCard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useAuth } from '../contexts/AuthContext';

const colors = {
  primary: '#8e7cc3',
  accent: '#5edfff',
  textPrimary: '#2D264B',
};

const ClassInchargeLogin = () => {
  const [values, setValues] = useState({ email: '', staffId: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email || !values.staffId) return;
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'Staff',
          user: values.email,
          password: values.staffId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        login({ ...data.user, role: data.role });
        navigate(`/dashboard/${data.role}`, { state: { user: data.user } });
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Server error');
    }
  };
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ background: 'transparent', position: 'relative' }}>
      <AnimatedBackground />
      <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', top: 24, left: 24, color: 'black', zIndex: 2, display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(255,255,255,0.7)', borderRadius: 2, px: 1, py: 0.5, boxShadow: 1 }}>
        <HomeIcon fontSize="medium" />
        <span style={{ fontWeight: 600, fontSize: 15 }}>Go to Home</span>
      </IconButton>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mb={2} zIndex={1} gap={2} mt={4}>
        <img src={logo} alt="VCET Logo" style={{ height: 54, marginRight: 12 }} />
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          mb={0}
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.7rem', lg: '2rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: '"Times New Roman", Times, serif',
            color: '#1565C0',
            fontWeight: 700,
            lineHeight: 1.2,
            animation: 'fadeInSlide 1.1s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 2px 8px 0 rgba(21,101,192,0.04)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
          }}
        >
          Velammal College of Engineering and Technology
        </Typography>
      </Box>
      <style>{`
        @keyframes fadeInSlide {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <Box sx={{ background: 'white', borderRadius: 4, boxShadow: 4, p: 3, minWidth: 340, maxWidth: 400, zIndex: 1 }}>
        <LoginCard
          title="Class Incharge Portal"
          subtitle="Manage and Monitor Class Progress"
          icon={<AssignmentIndIcon fontSize="large" sx={{ color: colors.accent }} />}
          fields={[
            { name: 'email', label: 'Email', required: true, type: 'email' },
            { name: 'staffId', label: 'Staff ID', required: true },
          ]}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          buttonText="Login as Class Incharge"
        />
      </Box>
    </Box>
  );
};

export default ClassInchargeLogin; 