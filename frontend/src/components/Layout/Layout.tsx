import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <NavBar />
      <Box component="main" sx={{ width: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
