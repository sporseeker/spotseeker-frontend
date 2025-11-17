import { LoginForm } from "@/components/auth/LoginForm";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { DeletionForm } from "@/components/deletion-form";

const SignIn = async () => {
  return (
    <AuthWrapper>
      <DeletionForm />
    </AuthWrapper>
  );
};

export default SignIn;
