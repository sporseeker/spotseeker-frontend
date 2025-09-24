import AuthWrapper from "@/components/auth/auth-wrapper";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

const PasswordResetPage = async () => {
  return (
    <AuthWrapper>
      <PasswordResetForm />
    </AuthWrapper>
  );
};

export default PasswordResetPage;
