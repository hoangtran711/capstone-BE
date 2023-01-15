import { ErrorMessage } from '@common/exception';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async findOne(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
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
    const uid = uuid();
    const existing = await this.userModel
      .findOne({ $or: [{ email: email }, { username: username }] })
      .exec();
    if (existing) {
      throw new BadRequestException(
        ErrorMessage.Auth_UsernameAlreadyRegistered,
      );
    }

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
      password,
      emailVerified: false,
    }).save();

    return newUser;
  }

  async findOneAndDelete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }
}
