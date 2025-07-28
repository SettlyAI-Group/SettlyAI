import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RegistrationPage } from './pages';
import Box from '@mui/material/Box';

const App = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Routes>
        <Route path="/" element={<div>page</div>} />
        <Route path="/registration" element={<RegistrationPage />}></Route>
      </Routes>
    </Box>
  );
};

export default App;
