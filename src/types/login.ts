type CredentialsType = {
  email: string;
  password: string;
};
export enum ProviderType {
  GOOGLE = "google",
}
type SocialCredentialsType = {
  token: string;
  provider: ProviderType;
};

export type { CredentialsType, SocialCredentialsType };
