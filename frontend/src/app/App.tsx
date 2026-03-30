import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { SchedulePage } from './pages/SchedulePage';
import { TeachersPage } from './pages/TeachersPage';
import { GraduatesPage } from './pages/GraduatesPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactsPage } from './pages/ContactsPage';
import { ModelDaysPage } from './pages/ModelDaysPage';
import { SeasonalPage } from './pages/SeasonalPage';
import { CareerPage } from './pages/CareerPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'courses', Component: CoursesPage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'teachers', Component: TeachersPage },
      { path: 'graduates', Component: GraduatesPage },
      { path: 'about', Component: AboutPage },
      { path: 'blog', Component: BlogPage },
      { path: 'contacts', Component: ContactsPage },
      { path: 'become-model', Component: ModelDaysPage },
      { path: 'seasonal', Component: SeasonalPage },
      { path: 'career', Component: CareerPage },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
