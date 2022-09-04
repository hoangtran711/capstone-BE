import { Injectable } from '@nestjs/common';
import { CreateStudentDTO } from './dtos/create-student.dto';
import { ErrorMessage } from '@common/exception/error-message';

@Injectable()
export class AuthService {
  users = [];
  addUser(user: CreateStudentDTO): CreateStudentDTO {
    this.users.push(user);
    return user;
  }
  removeUser(): string {
    return ErrorMessage.INVALID_JWT;
  }
}
