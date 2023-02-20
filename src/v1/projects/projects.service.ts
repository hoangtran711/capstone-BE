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

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private usersService: UsersService,
    private projectJoinedService: ProjectJoinedService,
    @Inject(REQUEST) private request,
  ) {}

  async getUserCreatedOfProject(projectId: string) {
    const project = await this.projectModel.findById(projectId);
    return project.createdBy;
  }

  async getProjectDetail(projectId: string) {
    const userId = this.request.user.id;
    const project = await this.projectModel.findById(projectId).lean();
    console.log(project);
    const isJoined = await this.projectJoinedService.checkIfUserJoinedProject(
      project._id,
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

  async findOne(projectId: string) {
    return await this.projectModel.findById(projectId);
  }

  async getProjectsJoinedOfStudent() {
    const userId = this.request.user.id;
    const projects = await this.projectModel.find();
    const projectJoined = [];
    for (const project of projects) {
      const isJoined = await this.projectJoinedService.checkIfUserJoinedProject(
        project._id,
        userId,
      );
      if (isJoined) {
        projectJoined.push(project);
      }
    }
    return projectJoined;
  }

  async getProjectCurrentUser(): Promise<Project[]> {
    const userId = this.request.user.id;
    return await this.internalGetProjectByUserId(userId);
  }

  async getAllProject(): Promise<Project[]> {
    return await this.projectModel.find();
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
    for (let i = 0; i < learnDate.length; i++) {
      const date = new Date(learnDate[i]);
      const dayOfWeek = date.getDay();
      const atHour = date.getHours();
      const atMinute = date.getMinutes();
      const atSecond = date.getSeconds();
      learnDateFormated.push({ dayOfWeek, atHour, atMinute, atSecond });
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

    return await newProject.save();
  }
  private async internalGetProjectByUserId(userId: string): Promise<Project[]> {
    return await this.projectModel.find({ createdBy: userId });
  }
}
