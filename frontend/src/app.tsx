import { Route, Routes } from 'react-router-dom';
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
  );
};

export default App;
