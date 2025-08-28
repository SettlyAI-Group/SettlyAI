import { Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportButton = styled(Button)(({ theme }) => ({
  position: 'static',
  width: '100%',
  height: 48,
  whiteSpace: 'nowrap',
  color: '#fff',
  ...theme.typography.subtitle1,
  textTransform: 'none',
  [theme.breakpoints.between(900, 1150)]: {
    width: '48%',
    position: 'static',
    height: 56,
  },
  [theme.breakpoints.up(1150)]: {
    position: 'absolute',
    width: 200,
    left: '100%',
    height: 56,
    transform: 'translateX(36px)',
  },
}));

type Props = {
  onClick?: () => void;
};

const GetReportButton = ({ onClick }: Props) => {
  const navigate = useNavigate();
  return (
    <ReportButton variant="contained" onClick={onClick}>
      Get my report
    </ReportButton>
  );
};
export default GetReportButton;
