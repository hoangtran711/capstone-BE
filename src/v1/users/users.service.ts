import { ErrorMessage } from '@common/exception';
import { RoleEnum } from '@common/interfaces';
import { RolesGuard } from '@common/roles';
import {
  BadRequestException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { hash, genSalt } from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { UpdateUserDTO } from 'shared';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';

@Injectable()
@UseGuards(RolesGuard, JwtAuthGuard)
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(REQUEST) private request,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async findOne(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsernameOrEmail(username: string): Promise<User> {
    return await this.userModel.findOne({
      $or: [{ email: username }, { username: username }],
    });
  }

  async findByRole(role: string): Promise<User[]> {
    return await this.userModel.find({ role: role }).exec();
  }

  async checkRoleUser(userId: string, role: RoleEnum): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    return user.role === role;
  }

  async findOneMultiple(filter: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOne(filter);
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: string,
    role?: string,
  ): Promise<User> {
    const saltRounds = 10;
    const uid = uuid();
    const existing = await this.userModel
      .findOne({ $or: [{ email: email }, { username: username }] })
      .exec();
    if (existing) {
      throw new BadRequestException(
        ErrorMessage.Auth_UsernameAlreadyRegistered,
      );
    }

    const hashPassword = await this.generateHashPassword(password);

    const newUser = await new this.userModel({
      username,
      email,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
      uid,
      role,
      password: hashPassword,
      emailVerified: false,
    }).save();

    return newUser;
  }

  async updateUser({
    username,
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    address,
  }: UpdateUserDTO) {
    const userId = this.request.user.id;
    const foundUser = await this.userModel.findById(userId);
    if (!foundUser) {
      throw new BadRequestException();
    }
    let hashPassword = foundUser.password;
    if (password) {
      hashPassword = await this.generateHashPassword(password);
    }

    foundUser.username = username || foundUser.username;
    foundUser.email = email || foundUser.email;
    foundUser.password = hashPassword;
    foundUser.firstName = firstName || foundUser.firstName;
    foundUser.lastName = lastName || foundUser.lastName;
    foundUser.dateOfBirth = dateOfBirth || foundUser.dateOfBirth;
    foundUser.phoneNumber = phoneNumber || foundUser.phoneNumber;
    foundUser.address = address || foundUser.address;

    return await foundUser.save();
  }

  async findOneAndDelete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }

  private async generateHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashPassword = await hash(password, salt);
    return hashPassword;
  }
}
