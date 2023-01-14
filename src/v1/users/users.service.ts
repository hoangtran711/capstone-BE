import { RoleEnum } from '@common/interfaces';
import { Injectable } from '@nestjs/common';
import { User } from 'entities';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      email: 'trannbhoang@kms-technology.com',
      emailVerified: true,
      password: '$2b$10$mm7WrBVOhczPErOUcM8ed.OEEoceVCnP9Cbs7OcRahCq7U5SpVlaq',
      username: 'hoangtran711',
      avatar: '',
      role: RoleEnum.Admin,
      dateOfBirth: '07/11/2000',
      phoneNumber: '0586434251',
      address: '53 Tran Ke Xuong quan Phu Nhuan',
      uid: uuid(),
    },
  ];

  async getAll(): Promise<User[]> {
    return this.users;
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async register(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: string,
  ): Promise<User> {
    const uid = uuid();
    const index = this.users.push({
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      uid,
      address,
      emailVerified: false,
    });
    return this.users[index];
  }
}
