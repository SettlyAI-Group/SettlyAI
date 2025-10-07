import { styled, Typography, Box, alpha } from '@mui/material';

const HighlightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  textAlign: 'left',
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  flex: 1,
  minWidth: 0,
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignSelf: 'flex-end',
  marginLeft: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const HighlightSection = () => {
  return (
    <HighlightContainer>
      <LeftContainer>
        <Typography variant="subtitle2">Low Crime</Typography>
        <Typography variant="subtitle2">Low Crime</Typography>
        <Typography variant="subtitle2">Low Crime</Typography>
        <Typography variant="subtitle2">Low Crime</Typography>
      </LeftContainer>

      <RightContainer>
        <Typography variant="subtitle2">Low Crime</Typography>
      </RightContainer>
    </HighlightContainer>
  );
};

export default HighlightSection;
