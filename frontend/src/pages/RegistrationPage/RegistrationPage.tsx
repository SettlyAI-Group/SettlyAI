import { CenteredContainer } from '@/components/CenteredContainer';
import { RegistrationIntro, RegistrationForm } from './Components';

export const RegistrationPage: React.FC = () => {
  return (
    <CenteredContainer
      maxWidth="sm"
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <RegistrationIntro />
      <RegistrationForm />
    </CenteredContainer>
  );
};
