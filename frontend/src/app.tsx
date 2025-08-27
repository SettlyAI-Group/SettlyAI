import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import ThemeDemo from '@/pages/ThemeDemo';
import HomePage from '@/pages/HomePage/HomePage';
import SuburbReportPage from './pages/SuburbReportPage';
import Layout from './components/Layout/Layout';
import './App.css';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExplorePage from './pages/ExplorePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/theme" element={<ThemeDemo />} />
            <Route index element={<HomePage />} />

            <Route path="/explore/:location" element={<ExplorePage />} />
            <Route path="/suburb/:location" element={<SuburbReportPage />} />
          </Route>
          <Route path="/" element={<ThemeDemo />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
