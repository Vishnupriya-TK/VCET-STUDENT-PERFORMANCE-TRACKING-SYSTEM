import Portfolio from './Portfolio';
import PersonalInfo from './PersonalInfo';
import CGPACalculator from './CGPACalculator';
import Notifications from './Notifications';
import AcademicPerformance from './AcademicPerformance';

const studentDashboardRoutes = [
  {
    path: 'portfolio',
    element: <Portfolio />,
  },
  {
    path: 'personal',
    element: <PersonalInfo />,
  },
  // Add other subpages here
  {
    path: 'cgpa-calculator',
    element: <CGPACalculator />,
  },
  {
    path: 'notifications',
    element: <Notifications />,
  },
  {
    path: 'performance',
    element: <AcademicPerformance />,
  },
];

export default studentDashboardRoutes; 