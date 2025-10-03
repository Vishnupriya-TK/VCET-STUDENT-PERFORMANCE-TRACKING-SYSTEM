import React from 'react';
import ClassInchargeDashboard from './index';
import Home from './Home';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';
import AcademicPerformance from './AcademicPerformance';
import MentorAnalysis from './MentorAnalysis';
import SemesterMarks from './SemesterMarks';
import SemesterCourses from './SemesterCourses';

const classInchargeRoutes = [
  {
    path: '/dashboard/class-incharge',
    element: <ClassInchargeDashboard />,
    children: [
      { index: true, element: <Home /> },
      { path: 'students', element: <StudentList /> },
      { path: 'students/:id', element: <StudentDetails /> },
      { path: 'performance', element: <AcademicPerformance /> },
      { path: 'mentor-analysis', element: <MentorAnalysis /> },
      { path: 'marks', element: <SemesterMarks /> },
      { path: 'courses', element: <SemesterCourses /> },
    ],
  },
];

export default classInchargeRoutes; 