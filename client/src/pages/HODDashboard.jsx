import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const HODDashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <DashboardLayout title="HOD Dashboard" user={user}>
      {/* Add HOD-specific content here */}
    </DashboardLayout>
  );
};

export default HODDashboard; 