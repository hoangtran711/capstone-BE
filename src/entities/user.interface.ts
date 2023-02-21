import { RoleEnum } from '@common/interfaces';
import { VerifyStatus } from 'shared/enums/user.enum';

export interface User {
  email?: string;
  emailVerified?: VerifyStatus;
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
