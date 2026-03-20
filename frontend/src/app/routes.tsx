import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { AboutPage } from './pages/AboutPage';
import { TeachersPage } from './pages/TeachersPage';
import { SchedulePage } from './pages/SchedulePage';
import { CareerPage } from './pages/CareerPage';
import { GraduatesPage } from './pages/GraduatesPage';
import { ModelPage } from './pages/ModelPage';
import { BlogPage } from './pages/BlogPage';
import { ContactsPage } from './pages/ContactsPage';
import { SeasonalPage } from './pages/SeasonalPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'courses', Component: CoursesPage },
      { path: 'about', Component: AboutPage },
      { path: 'teachers', Component: TeachersPage },
      { path: 'schedule', Component: SchedulePage },
      { path: 'career', Component: CareerPage },
      { path: 'graduates', Component: GraduatesPage },
      { path: 'become-model', Component: ModelPage },
      { path: 'blog', Component: BlogPage },
      { path: 'contacts', Component: ContactsPage },
      { path: 'seasonal', Component: SeasonalPage },
    ],
  },
]);
