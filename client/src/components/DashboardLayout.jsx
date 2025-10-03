import React from 'react';
import { Box } from '@mui/material';
import AnimatedBackground from './AnimatedBackground';


const DashboardLayout = ({ user, onLogout, sidebar, children }) => {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex' }}>
      <AnimatedBackground />
      {sidebar}
      <Box sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
        <ClassHeader user={user} onLogout={onLogout} />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 