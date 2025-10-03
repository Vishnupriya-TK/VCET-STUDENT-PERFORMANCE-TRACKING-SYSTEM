import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const MentorDashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <DashboardLayout title="Mentor Dashboard" user={user}>
      {/* Add mentor-specific content here */}
    </DashboardLayout>
  );
};

export default MentorDashboard; 