import { Route, Routes } from 'react-router';
import SiteLayout from './components/layout/SiteLayout';
import RouteEffects from './components/common/RouteEffects';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import TipsPage from './pages/TipsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
