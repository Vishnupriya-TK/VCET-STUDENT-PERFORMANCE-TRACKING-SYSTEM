import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Avatar, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/student' },
  { text: 'Personal Info', icon: <PersonIcon />, path: '/dashboard/student/personal' },
  { text: 'Portfolio', icon: <AssignmentIndIcon />, path: '/dashboard/student/portfolio' },
  { text: 'Academic Performance', icon: <BarChartIcon />, path: '/dashboard/student/performance' },
  { text: 'GPA & CGPA Calculator', icon: <CalculateIcon />, path: '/dashboard/student/cgpa-calculator' }
];

const drawerWidth = 240;
const collapsedWidth = 72;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #4B006E 0%, #7C1FA0 100%)',
          color: 'white',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          borderRight: 0,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: collapsed ? 'center' : 'flex-start', 
        p: collapsed ? 1 : 2,
        minHeight: 64
      }}>
        <IconButton 
          onClick={() => setCollapsed(!collapsed)} 
          sx={{ 
            color: 'white',
            mb: collapsed ? 0 : 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {user?.Name?.[0]}
            </Avatar>
            <Box sx={{ ml: 1, overflow: 'hidden' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.Name}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}
              >
                {user?.['E-mail'] || user?.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              px: collapsed ? 2.5 : 3,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'white',
              '&.Mui-selected': {
                background: 'rgba(255,255,255,0.08)',
                color: '#FFD700',
                '&:hover': {
                  background: 'rgba(255,255,255,0.12)',
                },
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: collapsed ? 0 : 2, 
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                  },
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, pb: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={handleLogout}
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{
            background: 'linear-gradient(90deg,rgb(161, 127, 225) 0%,rgb(176, 152, 207) 100%)',
            color: '#2D264B',
            borderRadius: 2,
            fontWeight: 700,
            fontSize: '1rem',
            width: collapsed ? 48 : '100%',
            minWidth: 0,
            minHeight: 48,
            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
            '&:hover': {
              background: 'linear-gradient(90deg,rgb(172, 149, 202) 0%,rgb(172, 144, 225) 100%)',
            },
            py: 1.5,
            px: collapsed ? 0 : 2,
            justifyContent: 'center',
          }}
        >
          {!collapsed && 'Logout'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 