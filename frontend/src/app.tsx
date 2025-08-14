import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
import HomePage from '@/pages/HomePage/HomePage';
import SuburbReportPage from './pages/SuburbReportPage';
import Layout from './components/Layout/Layout';
import ExplorePage from '@/pages/ExplorePage/ExplorePage';
import ReportPage from '@/pages/ReportPage/ReportPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/" element={<Layout />}>
          <Route path="/theme" element={<ThemeDemo />} />
          <Route index element={<HomePage />} />

          <Route path="/suburb/:id" element={<ReportPage />} />
          <Route path="/explore/:location" element={<ExplorePage />} />
          <Route path="/suburb/:location" element={<SuburbReportPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};
    
export default App;
