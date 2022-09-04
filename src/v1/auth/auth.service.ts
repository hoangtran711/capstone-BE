import { Injectable } from '@nestjs/common';
import { CreateStudentDTO } from './dtos/create-student.dto';

@Injectable()
export class AuthService {
  users = [];
  addUser(user: CreateStudentDTO): CreateStudentDTO {
    this.users.push(user);
    return user;
  }
  removeUser(): string {
    return 'Removed';
  }
}
