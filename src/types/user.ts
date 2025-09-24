interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserType;
  token: string;
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  nic?: string;
  verified?: boolean;
}

type UserResponseType = {
  id?: string;
  username?: string;
  email: string;
  role: UserType;
  token: string;
  profile_photo_url: string;
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  nic?: string;
  verified?: boolean;
};

export type { UserType, UserResponseType };
