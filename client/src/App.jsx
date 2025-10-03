import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Welcome from './pages/Welcome';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import HODDashboard from './pages/HODDashboard';
import StudentLogin from './pages/StudentLogin';
import MentorLogin from './pages/MentorLogin';
import HODLogin from './pages/HODLogin';
import ClassInchargeLogin from './pages/ClassInchargeLogin';
import classInchargeRoutes from './pages/ClassInchargeDashboard/routes.jsx';
import studentDashboardRoutes from './pages/StudentDashboard/routes.jsx';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#B19CD9',
    },
    secondary: {
      main: '#D4C6E6',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/student" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/mentor" element={<MentorLogin />} />
      <Route path="/login/hod" element={<HODLogin />} />
      <Route path="/login/classincharge" element={<ClassInchargeLogin />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        {studentDashboardRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      <Route
        path="/dashboard/mentor"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hod"
        element={
          <ProtectedRoute allowedRoles={['hod']}>
            <HODDashboard />
          </ProtectedRoute>
        }
      />

      {/* Class Incharge Routes */}
      {classInchargeRoutes.map((route) => (
      <Route
          key={route.path}
          path={route.path}
        element={
            <ProtectedRoute allowedRoles={['class-incharge']}>
              {route.element}
          </ProtectedRoute>
        }
        >
          {route.children?.map((child) => (
            <Route
              key={child.path || 'index'}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
