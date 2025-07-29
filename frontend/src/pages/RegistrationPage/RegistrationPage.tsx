import { FormPageContainer } from '../../components/FormPageContainer';
import Box from '@mui/material/Box';
import { RegistrationIntro, RegistrationForm } from './Components';
import { styled } from '@mui/material/styles';

const RegistrationPageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
});

export const RegistrationPage = () => {
  return (
    <FormPageContainer>
      <RegistrationPageContainer>
        {/*RegistrationIntro 响应式 */}
        <RegistrationIntro />
        <RegistrationForm />
      </RegistrationPageContainer>
    </FormPageContainer>
  );
};
