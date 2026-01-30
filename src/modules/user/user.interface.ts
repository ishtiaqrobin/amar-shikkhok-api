export interface UpdateUserInput {
  name?: string;
  phone?: string;
  image?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}
