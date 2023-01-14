import { RoleEnum } from '@common/interfaces';

export interface User {
  email?: string;
  emailVerified?: boolean;
  password?: string;
  username?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  role?: RoleEnum;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  uid: string;
}
