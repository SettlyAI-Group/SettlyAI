import { useNavigate } from 'react-router-dom';
import { Box, styled } from '@mui/material';
import HeroSection from './components/HeroSection';
import ToolsSection from './components/ToolsSection/ToolsSection';

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const HomePage = () => {
  const navigate = useNavigate();

  type Suburb = {
    suburbName: string;
    state: string;
    suburbId: number;
  };
  //todo: change to fetch suburb id by suburb name and state
  //check database to match for testing
  const melbourne = { suburbName: 'Melbourn', state: 'VIC', suburbId: 1 };
  const sydney = { suburbName: 'Sydney', state: 'NSW', suburbId: 2 };

  const checkSuburb = (suburb: Suburb) => {
    const { suburbId } = suburb;

    localStorage.setItem('suburbId', suburbId.toString());

    navigate(`/suburb/${suburbId}`);
  };

  return (
    <Container>
      <HeroSection />
      <ToolsSection />
      <h1>Home</h1>
      <button onClick={() => checkSuburb(sydney)}>Go to Sydney</button>
      <button onClick={() => checkSuburb(melbourne)}>Go to Melbourne</button>
    </Container>
  );
};

export default HomePage;