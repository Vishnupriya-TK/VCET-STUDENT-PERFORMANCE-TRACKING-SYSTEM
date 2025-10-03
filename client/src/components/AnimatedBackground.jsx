import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Theme colors based on the UX School design - lighter variants
const colors = {
  primary: '#B19CD9', // Lighter purple as primary
  secondary: '#D4C6E6', // Even lighter purple
  accent: '#4CD964', // Mint green
};

const FloatingIcon = ({ Icon, top, left, delay, scale = 1, color }) => (
  <motion.div
    style={{
      position: 'absolute',
      top,
      left,
      color: color,
      fontSize: '2rem',
    }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{
      scale: [scale, scale * 1.2, scale],
      rotate: [0, 10, -10, 0],
      y: [0, -15, 0],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Icon fontSize="inherit" />
  </motion.div>
);

const GradientOrb = ({ top, left, size, delay }) => (
  <motion.div
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${colors.primary}15 0%, ${colors.secondary}10 50%, transparent 70%)`,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.1, 0.2],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Card-inspired color palette
const iconColors = {
  school: '#e1d7fa', // slightly deeper than card bg (#f3eaff)
  book: '#7c4dff',   // deep purple (card border)
  trophy: '#ffd600', // gold (accent)
};

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #e9d7fe 30%, #e9d7fe 60%, #e9d7fe 100%)', // match card bg
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 50%, #ffd60008 0%, transparent 60%)`, // subtle gold accent
          animation: 'pulse 10s infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.2)',
          },
        },
      }}
    >
      {/* Floating Icons with card-inspired colors */}
      <FloatingIcon Icon={SchoolIcon} top="15%" left="10%" delay={0} scale={1.5} color={iconColors.school} />
      <FloatingIcon Icon={MenuBookIcon} top="25%" left="80%" delay={1} scale={1.2} color={iconColors.book} />
      <FloatingIcon Icon={AutoStoriesIcon} top="75%" left="20%" delay={2} scale={1.3} color={iconColors.book} />
      <FloatingIcon Icon={EmojiEventsIcon} top="65%" left="70%" delay={3} scale={1.4} color={iconColors.trophy} />
      <FloatingIcon Icon={SchoolIcon} top="45%" left="40%" delay={4} scale={1.1} color={iconColors.school} />
      <FloatingIcon Icon={MenuBookIcon} top="85%" left="85%" delay={5} scale={1.2} color={iconColors.book} />

      {/* Gradient Orbs */}
      <GradientOrb top="20%" left="30%" size="300px" delay={0} />
      <GradientOrb top="70%" left="60%" size="250px" delay={2} />
      <GradientOrb top="40%" left="80%" size="200px" delay={4} />
      <GradientOrb top="80%" left="20%" size="350px" delay={6} />

      {/* Animated Grid */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03, // Very subtle grid
          background: `
            linear-gradient(90deg, transparent 0%, transparent 49%, #e1d7fa 50%, transparent 51%, transparent 100%),
            linear-gradient(0deg, transparent 0%, transparent 49%, #e1d7fa 50%, transparent 51%, transparent 100%)
          `,
          backgroundSize: '50px 50px',
          animation: 'moveBg 30s linear infinite',
          '@keyframes moveBg': {
            '0%': {
              backgroundPosition: '0 0',
            },
            '100%': {
              backgroundPosition: '50px 50px',
            },
          },
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, 
              #e9d7fe10 0%, 
              #e1d7fa10 25%, 
              #ffd60005 50%, 
              #e1d7fa10 75%, 
              #e9d7fe10 100%
            )
          `,
          animation: 'gradientMove 15s linear infinite',
          '@keyframes gradientMove': {
            '0%': {
              backgroundPosition: '0% 0%',
            },
            '100%': {
              backgroundPosition: '100% 100%',
            },
          },
          backgroundSize: '200% 200%',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground; 