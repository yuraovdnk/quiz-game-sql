export type UserDbDto = {
  login: string;
  email: string;
  passwordHash: string;
  confirmationCode?: string;
  expirationConfirmCode?: Date;
  isConfirmedEmail: boolean;
};

export enum SortedFieldsUser {
  login = 'login',
  email = 'email',
  createdAt = 'createdAt',
}
