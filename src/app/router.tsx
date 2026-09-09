import { createBrowserRouter } from 'react-router-dom';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SearchPage } from '../features/search/SearchPage';
import { Layout } from './Layout';

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: CalendarPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'search', Component: SearchPage },
    ],
  },
];

export const router = createBrowserRouter(routes);
