import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function getYearFromBatch(batch) {
  if (!batch) return '';
  const yearMap = {
    '2022-2026': '4th Year',
    '2023-2027': '3rd Year',
    '2024-2028': '2nd Year',
    '2025-2029': '1st Year',
  };
  return yearMap[batch] || '';
}

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const year = getYearFromBatch(user?.Batch);
  
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to Welcome page
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        px: 3,
        mb: 4,
        background: 'linear-gradient(90deg, #4B006E 0%, #7C1FA0 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: 2,
        position: 'sticky',
        top: 0,
        bottom: 50,
        left: 50,
        right: 50,
        zIndex: 1000,
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Welcome, {user?.Name || 'User'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Batch: {user?.Batch} | {year} | Dept: {user?.Dept} | Section: {user?.Section}
        </Typography>
      </Box>
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ fontWeight: 600 }}>
        Logout
      </Button>
    </Box>
  );
};

export default Header; 