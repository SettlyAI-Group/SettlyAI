import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RegistrationPage } from './pages';
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ThemeDemo />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </ThemeProvider>
||||||| parent of 97a1c6c (add auth api and add react query)
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
=======
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
>>>>>>> 97a1c6c (add auth api and add react query)
  );
};

export default App;
