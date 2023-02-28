import { ErrorMessage } from '@common/exception';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { MAX_DAY_LEARN_IN_WEEK, MIN_DAY_LEARN_IN_WEEK } from 'config';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'schemas';
import { CreateProjectDto } from './dtos/projects-request.dto';
import { ProjectJoinedService } from '../project-joined/project-joined.service';
import { UsersService } from 'v1/users/users.service';
import { StudentService } from 'v1/student/student.service';
import * as moment from 'moment';
import { RoleEnum } from '@common/interfaces';
import { getDates } from 'utils/date.util';
import { v4 as uuid } from 'uuid';
import {
  ProjectSchedule,
  ProjectScheduleDocument,
  Schedule,
  ScheduleDocument,
} from '@schemas/project-schedule.schema';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectSchedule.name)
    private projectScheduleModel: Model<ProjectScheduleDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private usersService: UsersService,
    private projectJoinedService: ProjectJoinedService,
    private studentServices: StudentService,
    @Inject(REQUEST) private request,
  ) {}

  async getUserCreatedOfProject(projectId: string) {
    const project = await this.projectModel.findById(projectId);
    return project.createdBy;
  }

  async getProjectDetail(projectId: string) {
    const userId = this.request.user.id;
    const project = await this.projectModel.findById(projectId).lean();
    const isJoined = await this.projectJoinedService.checkIfUserJoinedProject(
      project._id.toString(),
      userId,
    );
    const studentJoined =
      await this.projectJoinedService.getStudentJoinedProject(projectId);
    const students = [];
    for (const student of studentJoined) {
      const studentData = await this.usersService.findOne(student);
      students.push(studentData);
    }
    const approverInfo = await this.usersService.findOne(project.createdBy);
    return { ...project, isJoined, studentsInfo: students, approverInfo };
  }

  async getProjectsAttendance(projectId: string) {
    const now = new Date();
    const students = await this.projectJoinedService.getStudentJoinedProject(
      projectId,
    );
    const projectAttendance = [];
    for (const student of students) {
      const schedules = await this.studentServices.getShedulesByProjectId(
        projectId,
        student._id,
      );

      const filteredTime = schedules.times.filter((time) =>
        moment(time.date, 'dddd, MMMM Do YYYY, h:m:s').isSameOrBefore(
          moment(now),
        ),
      );

      projectAttendance.push({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        avatar: student.avatar,
        role: student.role,
        major: student.major,
        projectId,
        timesUntilNow: filteredTime,
        schedules,
      });
    }
    return projectAttendance;
  }

  async findOne(projectId: string) {
    return await this.projectModel.findById(projectId);
  }

  async getProjectsJoinedOfStudent() {
    const userId = this.request.user.id;
    const projects = await this.projectModel.find().lean();
    const projectJoined = [];
    for (const project of projects) {
      const approverInfo = await this.usersService.findOne(project.createdBy);
      const process = await this.getProgressOfProject(project._id);
      const isJoined = await this.projectJoinedService.checkIfUserJoinedProject(
        project._id,
        userId,
      );
      if (isJoined) {
        projectJoined.push({ ...project, approverInfo, process });
      }
    }
    return projectJoined;
  }

  async getProjectCurrentUser(): Promise<Project[]> {
    const userId = this.request.user.id;
    const role = this.request.user.role;
    if (role === RoleEnum.Admin) {
      return await this.internalGetProjectByUserId(userId);
    } else {
      return await this.getProjectsJoinedOfStudent();
    }
  }

  async getAllProject(): Promise<Project[]> {
    const projects = await this.projectModel.find().lean();
    const projectsInfo = [];
    for (const project of projects) {
      const process = await this.getProgressOfProject(project._id);
      const studentJoined =
        await this.projectJoinedService.getStudentJoinedProject(project._id);
      const approverInfo = await this.usersService.findOne(project.createdBy);
      projectsInfo.push({ ...project, studentJoined, approverInfo, process });
    }
    return projectsInfo;
  }

  async getProgressOfProjects(projectIds: string[]) {
    const progresses = [];
    for (const projectId of projectIds) {
      const foundProject = await this.projectModel.findById(projectId);
      const startDate = new Date(foundProject.startDate).getTime();
      const endDate = new Date(foundProject.endDate).getTime();
      const now = new Date().getTime();
      if (now < startDate) {
        progresses.push(0);
      } else if (now < endDate) {
        progresses.push((now - startDate) / (endDate - startDate));
      } else {
        progresses.push(100);
      }
    }
    return progresses;
  }

  async createProject(projectDto: CreateProjectDto) {
    const {
      projectName,
      projectDescription,
      learnDate,
      startDate,
      endDate,
      attendanceAfterMinute,
      maxJoin,
      totalLesson,
    } = projectDto;
    const foundProject = await this.projectModel
      .findOne({ projectName })
      .exec();
    if (foundProject) {
      throw new BadRequestException(ErrorMessage.Project_AlreadyCreated);
    }
    if (
      learnDate.length > MAX_DAY_LEARN_IN_WEEK ||
      learnDate.length < MIN_DAY_LEARN_IN_WEEK
    ) {
      throw new BadRequestException();
    }
    const learnDateFormated = [];
    const schedules = [];
    for (let i = 0; i < learnDate.length; i++) {
      const date = new Date(learnDate[i].time);
      const dayOfWeek = date.getDay();
      const atHour = date.getHours();
      const atMinute = date.getMinutes();
      const atSecond = date.getSeconds();
      learnDateFormated.push({ dayOfWeek, atHour, atMinute, atSecond });
      let times = [
        ...getDates(
          moment(startDate)
            .set('hours', atHour)
            .set('minutes', atMinute)
            .set('second', atSecond),
          moment(endDate)
            .set('hours', atHour)
            .set('minutes', atMinute)
            .set('second', atSecond),
          dayOfWeek,
        ),
      ];

      for (const time of times) {
        schedules.push(
          new this.scheduleModel({
            location: learnDate[i].location,
            startTime: time,
            endTime: moment(time).add(totalLesson, 'hours'),
            attendanceAt: [
              {
                _id: uuid(),
                start: moment(time),
                end: moment(time).add(attendanceAfterMinute, 'minutes'),
                studentJoined: [],
              },
            ],
          }),
        );
      }
    }

    const newProject = new this.projectModel({
      projectName,
      projectDescription,
      learnDate: learnDateFormated,
      startDate,
      endDate,
      attendanceAfterMinute,
      maxJoin,
      totalLesson,
      joined: 0,
      createdBy: this.request.user.id,
    });

    const newSchedule = new this.projectScheduleModel({
      projectId: newProject._id,
      schedules: schedules,
    });
    await newSchedule.save();

    return await newProject.save();
  }
  private async internalGetProjectByUserId(userId: string): Promise<Project[]> {
    const approverInfo = await this.usersService.findOne(userId);
    const projects = await this.projectModel.find({ createdBy: userId }).lean();
    const projectsInfo = [];
    for (const project of projects) {
      const studentJoined =
        await this.projectJoinedService.getStudentJoinedProject(
          project._id.toString(),
        );
      const process = await this.getProgressOfProject(project._id);
      projectsInfo.push({ ...project, studentJoined, approverInfo, process });
    }

    return projectsInfo;
  }
  async getProgressOfProject(projectId: string) {
    const foundProject = await this.projectModel.findById(projectId);
    const startDate = new Date(foundProject.startDate).getTime();
    const endDate = new Date(foundProject.endDate).getTime();
    const now = new Date().getTime();
    if (now < startDate) {
      return 0;
    } else if (now < endDate) {
      return ((now - startDate) / (endDate - startDate)) * 100;
    } else {
      return 100;
    }
  }
}
