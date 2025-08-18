import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
import AltHomePage from '@/pages/HomePage/AltHomePage';
import SuburbReportPage from './pages/SuburbReportPage';
import Layout from './components/Layout/Layout';
import './App.css';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

const App = () => {
  return (
<<<<<<< HEAD
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/theme" element={<ThemeDemo />} />
            <Route index element={<HomePage />} />

            <Route path="/suburb/:location" element={<SuburbReportPage />} />
          </Route>
          <Route path="/" element={<ThemeDemo />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
=======
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/theme" element={<ThemeDemo />} />
          <Route index element={<AltHomePage />} />
          <Route path="/suburb/:location" element={<SuburbReportPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
>>>>>>> 6c3727c (finish structure)
  );
};

export default App;
