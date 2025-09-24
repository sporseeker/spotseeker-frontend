import AuthWrapper from "@/components/auth/auth-wrapper";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { FC } from "react";
interface NewPasswordProps {
  params: { token: string };
}
const NewPassword: FC<NewPasswordProps> = async ({ params }) => {
  return (
    <AuthWrapper>
      <NewPasswordForm token={params.token} />
    </AuthWrapper>
  );
};

export default NewPassword;
