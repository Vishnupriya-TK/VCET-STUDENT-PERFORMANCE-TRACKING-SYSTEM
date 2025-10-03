import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, Box, Avatar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/class-incharge' },
  { text: 'Student List', icon: <PeopleIcon />, path: '/dashboard/class-incharge/students' },
  { text: 'Academic Performance', icon: <BarChartIcon />, path: '/dashboard/class-incharge/performance' },
  { text: 'Semester Marks', icon: <EditIcon />, path: '/dashboard/class-incharge/marks' },
  { text: 'Mentor Analysis', icon: <GroupIcon />, path: '/dashboard/class-incharge/mentor-analysis' },
  { text: 'Semester Courses', icon: <MenuBookIcon />, path: '/dashboard/class-incharge/courses' },
];

const drawerWidth = 240;
const collapsedWidth = 72;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

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
                {user?.["E-mail"]}
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
    </Drawer>
  );
};

export default Sidebar;