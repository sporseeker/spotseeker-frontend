import { RegisterForm } from "@/components/auth/RegisterForm";
import AuthWrapper from "@/components/auth/auth-wrapper";

const Register = async () => {
  return (
    <AuthWrapper>
      <RegisterForm />
    </AuthWrapper>
  );
};

export default Register;
