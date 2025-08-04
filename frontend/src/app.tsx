import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
import HomePage from '@/pages/HomePage';
import SettlyHomePage from '@/pages/HomePage/SettlyHomePage';
import SettlyLoanPage from '@/pages/HomePage/SettlyLoanPage';
import SettlySuperPage from '@/pages/HomePage/SettlySuperPage';
import './App.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features/settlyhome" element={<SettlyHomePage />} />
        <Route path="/features/settlyloan" element={<SettlyLoanPage />} />
        <Route path="/features/settlysuper" element={<SettlySuperPage />} />
        <Route path="/theme-demo" element={<ThemeDemo />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
