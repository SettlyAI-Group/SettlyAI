import { FormPageContainer } from '../../components/FormPageContainer';
import { RegistrationIntro} from './Components/RegistrationIntro';
import { RegistrationForm } from './Components/RegistrationForm';




export const RegistrationPage = () => {
  return (
    <FormPageContainer>
      <RegistrationIntro />
      <RegistrationForm />
    </FormPageContainer>
  );
};
