import React, { useState } from 'react';
import { Box } from '@mui/material';
import AnimatedBackground from '../../components/AnimatedBackground';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex' }}>
      <AnimatedBackground />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Box sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 