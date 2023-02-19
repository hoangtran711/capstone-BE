import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { StudentJoin, StudentJoinDocument } from '@schemas/student-join.schema';
import { Model } from 'mongoose';
import { UsersService } from 'v1/users/users.service';

@Injectable()
export class ProjectJoinedService {
  constructor(
    private usersService: UsersService,
    @InjectModel(StudentJoin.name)
    private projectJoinedModel: Model<StudentJoinDocument>,
    @Inject(REQUEST) private request,
  ) {}
  async checkIfUserJoinedProject(projectId: string, userId: string) {
    const foundProject = await this.projectJoinedModel.findOne({ projectId });
    if (!foundProject) {
      return false;
    }
    return foundProject.studentsJoined.includes(userId);
  }

  async getStudentJoinedProject(projectId: string) {
    const projectJoined = await this.projectJoinedModel.findOne({ projectId });
    const students = projectJoined.studentsJoined;
    const allUsers: any = await this.usersService.getAll();
    const studentsInfo = allUsers.filter((user) => students.includes(user.id));
    return studentsInfo;
  }
}
