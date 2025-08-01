import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RegistrationPage } from './pages';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ThemeDemo />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
