import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
import './App.css';
import HomePage from '@/pages/HomePage/HomePage';
import SuburbReportPage from './pages/SuburbReportPage';
import Layout from './components/Layout/Layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/suburb-report-page" element={<SuburbReportPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/theme" element={<ThemeDemo />} />
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
