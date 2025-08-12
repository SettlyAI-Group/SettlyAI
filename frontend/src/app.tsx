import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
<<<<<<< HEAD
import './App.css';
import SuburbReportPage from '@/pages/SuburbReportPage/SuburbReportPage';
||||||| 2d621c8
import './App.css';
=======
import HomePage from '@/pages/HomePage/HomePage';
import SuburbReportPage from './pages/SuburbReportPage';
import Layout from './components/Layout/Layout';
>>>>>>> origin/main

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<ThemeDemo />} />
        <Route path="/suburb-report-page" element={<SuburbReportPage />} />
||||||| 2d621c8
        <Route path="/" element={<ThemeDemo />} />
=======
        <Route path='/' element={<Layout/>}>
          <Route path="/theme" element={<ThemeDemo />} />
          <Route index element={<HomePage />} />
  
          <Route path="/suburb/:location" element={<SuburbReportPage />} />
        </Route>
>>>>>>> origin/main
      </Routes>
    </ThemeProvider>
  );
};

export default App;
