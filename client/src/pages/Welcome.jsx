import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
} from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';
import { buttonStyles, missionVisionCardStyles } from '../styles/shared';
import HomeIcon from '@mui/icons-material/Home';

// Theme colors
const colors = {
  primary: '#B19CD9',
  secondary: '#D4C6E6',
  accent: '#4CD964',
  textPrimary: '#2D264B',
  headerBlue: '#1565C0',
};

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <AnimatedBackground />
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 2,
                flexDirection: 'row',
                gap: 2,
              }}
            >
              <img src={logo} alt="VCET Logo" style={{ height: 70, marginRight: 16 }} />
              <Typography
                variant="h3"
                component="h1"
                align="center"
                sx={{
                  color: colors.headerBlue,
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '1.4rem', sm: '1.5rem', md: '2.0rem' },
                }}
              >
                Velammal College of Engineering and Technology
              </Typography>
            </Box>
          </motion.div>
<br/><br/>
          {/* Welcome Text */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{
                color: colors.textPrimary,
                fontWeight: 600,
                mb: 6,
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              Welcome to the Student Performance Tracking System
            </Typography>
          </motion.div>

          {/* Mission and Vision Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              maxWidth: 1000,
              width: '100%',
              mb: 6,
              mx: 'auto',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <motion.div variants={itemVariants} style={{ flex: 1 }}>
              <Card sx={missionVisionCardStyles}>
                <Typography
                  variant="h4"
                  component="h3"
                  align="center"
                  sx={{
                    color: colors.primary,
                    fontWeight: 500,
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Mission
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: colors.textPrimary }}
                >
                  To foster academic excellence and holistic development through comprehensive performance tracking and mentoring.
                </Typography>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} style={{ flex: 1 }}>
              <Card sx={missionVisionCardStyles}>
                <Typography
                  variant="h4"
                  component="h3"
                  align="center"
                  sx={{
                    color: colors.primary,
                    fontWeight: 500,
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Vision
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: colors.textPrimary }}
                >
                  To be a leading institution in student performance management and academic excellence.
                </Typography>
              </Card>
            </motion.div>
          </Box>

          {/* Login Buttons */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login/student')}
                  sx={{
                    ...buttonStyles,
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: 'rgba(218, 181, 233, 0.9)',
                      color: colors.textPrimary,
                    },
                  }}
                >
                  Student Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login/mentor')}
                  sx={{
                    ...buttonStyles,
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: 'rgba(218, 181, 233, 0.9)',
                      color: colors.textPrimary,
                    },
                  }}
                >
                  Mentor Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login/hod')}
                  sx={{
                    ...buttonStyles,
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: 'rgba(218, 181, 233, 0.9)',
                      color: colors.textPrimary,
                    },
                  }}
                >
                  HOD Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login/classincharge')}
                  sx={{
                    ...buttonStyles,
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: 'rgba(218, 181, 233, 0.9)',
                      color: colors.textPrimary,
                    },
                  }}
                >
                  Class Incharge Login
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
      <style>{`
        @keyframes fadeInSlide {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default Welcome; 