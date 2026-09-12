import { createBrowserRouter } from 'react-router-dom';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { GoalsPage } from '../features/goals/GoalsPage';
import { SearchPage } from '../features/search/SearchPage';
import { Layout } from './Layout';

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: CalendarPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'goals', Component: GoalsPage },
      { path: 'search', Component: SearchPage },
    ],
  },
];

export const router = createBrowserRouter(routes);
