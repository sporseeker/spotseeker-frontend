import { LoginForm } from "@/components/auth/LoginForm";
import AuthWrapper from "@/components/auth/auth-wrapper";

const SignIn = async () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};

export default SignIn;
