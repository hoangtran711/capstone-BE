import { RoleEnum } from '@common/interfaces';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProjectSchedule,
  ProjectScheduleDocument,
} from '@schemas/project-schedule.schema';
import { Project, ProjectDocument } from '@schemas/project.schema';
import { StudentJoin, StudentJoinDocument } from '@schemas/student-join.schema';

import * as moment from 'moment';
import { Model } from 'mongoose';
import { DisabledUserService } from 'v1/disabled-user/disabled-user.service';
import { UsersService } from 'v1/users/users.service';
import { UpdateUserLeaveStatusDto } from './dtos/student-request.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(StudentJoin.name)
    private studentJoinModel: Model<StudentJoinDocument>,
    @InjectModel(ProjectSchedule.name)
    private projectScheduleModel: Model<ProjectScheduleDocument>,
    @Inject(REQUEST) private request,
    private userService: UsersService,
    private disabledUserService: DisabledUserService,
  ) {}

  async currentUserGetAllSchedule() {
    const userId = this.request.user.id;
    return await this.getAllSchedules(userId);
  }

  async createJoinProjectForUserId(projectId: string, userId: string) {
    const response = await this.joinProject(projectId, userId);
    return response;
  }
  async getTodayAttendance() {
    const userId = this.request.user.id;
    const projects = await this.studentJoinModel.find().lean();
    const projectUserJoined = projects.filter((project) =>
      project.studentsJoined.includes(userId),
    );
    const today = [];
    for (const project of projectUserJoined) {
      const projectId = project.projectId;
      const projectDetail = await this.projectModel.findById(projectId).lean();
      const projectSchedule = await this.projectScheduleModel.findOne({
        projectId,
      });
      const schedules = projectSchedule.schedules;
      const schedulesUntilNow = schedules.filter((schedule) => {
        const startTime = new Date(schedule.startTime);
        return moment().isSame(startTime, 'date');
      });
      if (schedulesUntilNow.length !== 0) {
        today.push({ ...projectDetail, schedules: schedulesUntilNow });
      }
    }
    return today;
  }

  async getStudentHistoryAttendance(userId: string) {
    const projects = await this.studentJoinModel.find().lean();
    const projectUserJoined = projects.filter((project) =>
      project.studentsJoined.includes(userId),
    );
    const history = [];
    for (const project of projectUserJoined) {
      const projectId = project.projectId;
      const projectSchedule = await this.projectScheduleModel.findOne({
        projectId,
      });
      const schedules = projectSchedule.schedules;
      const schedulesUntilNow = schedules.filter((schedule) => {
        const startTime = new Date(schedule.startTime);
        return moment().isAfter(startTime);
      });
      if (schedulesUntilNow.length !== 0) {
        history.push({ ...project, schedules: schedulesUntilNow });
      }
    }
    return history;
  }

  async deleteUserFromProject(projectId: string, userId: string) {
    return [];
  }

  async getCurrentAttendanceActive() {
    return [];
  }

  async getAllScheduleOfStudent(userId: string) {
    return await this.getAllSchedules(userId);
  }

  async createUserJoinProject(projectId, userId) {
    const isStudentUser = this.userService.checkRoleUser(
      userId,
      RoleEnum.EndUser,
    );
    if (!isStudentUser) {
      throw new BadRequestException();
    }
    return await this.joinProject(projectId, userId);
  }

  async currentUserJoinProject(projectId: string) {
    const userId = this.request.user.id;
    return await this.joinProject(projectId, userId);
  }

  async currentUserAttendance(
    projectId: string,
    attendanceId: string,
    geoLocation: string,
  ) {
    const userId = this.request.user.id;
    const foundProjectSchedule = await this.projectScheduleModel.findOne({
      projectId,
    });
    if (!foundProjectSchedule) {
      throw new BadRequestException('Not found schedule');
    }
    const schedules = foundProjectSchedule.schedules;
    // const geoLocationDecrypted = JSON.parse(decryptData(geoLocation));
    let attendance = null;
    for (const schedule of schedules) {
      schedule.attendanceAt.map((at, index) => {
        const isAttendance = at._id === attendanceId;
        if (isAttendance) {
          attendance = at;
        }
      });
    }
    // const distance = getDistanceFromLatLonInKm(
    //   geoLocationDecrypted.latitude,
    //   geoLocationDecrypted.longitude,
    // );
    // if (distance > LIMIT_DISTANCE_IN_KM) {
    //   throw new BadRequestException(
    //     'Your location cannot attendance, Please come to nearly class to attendace',
    //   );
    // }

    return await this.attendance(attendanceId, projectId, userId);
  }

  async updateLeaveStatus(userId: string, body: UpdateUserLeaveStatusDto) {
    return [];
  }

  private async joinProject(projectId: string, userId: string) {
    const foundProjectJoined = await this.studentJoinModel.findOne({
      projectId,
    });
    if (foundProjectJoined) {
      const studentJoined = [...foundProjectJoined.studentsJoined];
      const isStudentJoined = studentJoined.includes(userId);
      if (isStudentJoined) {
        throw new BadRequestException('Student Joined');
      }
      studentJoined.push(userId);
      foundProjectJoined.studentsJoined = studentJoined;
      return await foundProjectJoined.save();
    } else {
      const newProjectJoined = new this.studentJoinModel({
        projectId,
        studentsJoined: [userId],
      });
      return await newProjectJoined.save();
    }
  }

  private async getAllSchedules(userId: string) {
    return [];
  }

  async getShedulesByProjectId(projectId: string, userId: string) {
    return null;
  }

  private async attendance(
    attendanceId: string,
    projectId: string,
    userId: string,
  ) {
    const isDisabled = await this.disabledUserService.checkIfUserDisabled(
      projectId,
      userId,
    );
    if (isDisabled) {
      throw new BadRequestException(
        'User is disabled from project ' + projectId,
      );
    }
    const foundProjectSchedule = await this.projectScheduleModel.findOne({
      projectId,
    });
    if (!foundProjectSchedule) {
      throw new BadRequestException();
    }
    const schedules = [...foundProjectSchedule.schedules];
    for (const schedule of schedules) {
      for (const attendance of schedule.attendanceAt) {
        if (attendance._id === attendanceId) {
          const startTime = new Date(attendance.start);
          const endTime = new Date(attendance.end);
          attendance.studentJoined.push(userId);
        }
      }
    }
    foundProjectSchedule.schedules = schedules;
    return await this.projectScheduleModel.findByIdAndUpdate(
      foundProjectSchedule._id,
      foundProjectSchedule,
      { new: true },
    );
  }
}
