import { FormPageContainer } from '../../components/FormPageContainer';
import LoginForm from './Components/LoginForm';
import LoginIntro from './Components/LoginIntro';

const LoginPage = () => {
  return (
    <FormPageContainer>
        <LoginIntro />
        <LoginForm />
    </FormPageContainer>
  )
}

export default LoginPage