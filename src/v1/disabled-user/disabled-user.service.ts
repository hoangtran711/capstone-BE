import { ErrorMessage } from '@common/exception';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentDisabled,
  StudentDisabledDocument,
} from '@schemas/student-disabled.schema';
import { Model } from 'mongoose';
import { UsersService } from 'v1/users/users.service';

@Injectable()
export class DisabledUserService {
  constructor(
    @InjectModel(StudentDisabled.name)
    private disabledModel: Model<StudentDisabledDocument>,
    private usersService: UsersService,
    @Inject(REQUEST) private request,
  ) {}

  async getAllDisabledStudents(projectId: string) {
    const foundProject = await this.disabledModel.findOne({ projectId }).lean();
    if (!foundProject) {
      throw new BadRequestException(ErrorMessage.Project_NotFound);
    }
    const studentsDisabled = foundProject.studentsDisabled;
    const studentFormated = [];
    for (const studentId of studentsDisabled) {
      const student = await this.usersService.findOne(studentId);
      studentFormated.push(student);
    }
    return studentFormated;
  }

  async checkIfUserDisabled(projectId: string, userId: string) {
    const foundProject = await this.disabledModel.findOne({ projectId });
    if (foundProject) {
      const studentsDisabled = [...foundProject.studentsDisabled];
      const foundStudent = studentsDisabled.find(
        (studentId) => studentId === userId,
      );
      return !!foundStudent;
    }
    return false;
  }

  async removeStudentDisabled(projectId: string, userId: string) {
    const foundProject = await this.disabledModel.findOne({ projectId });
    if (!foundProject) {
      throw new BadRequestException(ErrorMessage.Project_NotFound);
    }
    const studentsDisabled = [...foundProject.studentsDisabled];
    const studentsDisabledFiltered = studentsDisabled.filter(
      (studentId) => studentId !== userId,
    );
    foundProject.studentsDisabled = studentsDisabledFiltered;
    return await foundProject.save();
  }
}
