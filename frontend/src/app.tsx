import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RegistrationPage } from './pages';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>page</div>} />
      <Route path="/registration" element={<RegistrationPage />}></Route>
    </Routes>
  );
};

export default App;
