import { FormPageContainer } from '../../components/FormPageContainer';
import Box from '@mui/material/Box';
import { RegistrationIntro} from './Components/RegistrationIntro';
import { RegistrationForm } from './Components/RegistrationForm';
import { styled } from '@mui/material/styles';

const RegistrationPageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(21),
}));

export const RegistrationPage = () => {
  return (
    <FormPageContainer>
      <RegistrationPageContainer>
        <RegistrationIntro />
        <RegistrationForm />
      </RegistrationPageContainer>
    </FormPageContainer>
  );
};
