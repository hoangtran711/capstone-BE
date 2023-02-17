import { ErrorMessage } from '@common/exception';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { MAX_DAY_LEARN_IN_WEEK, MIN_DAY_LEARN_IN_WEEK } from 'config';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'schemas';
import { CreateProjectDto } from './dtos/projects-request.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(REQUEST) private request,
  ) {}

  async getProjectCurrentUser(): Promise<Project[]> {
    const userId = this.request.user.id;
    return await this.internalGetProjectByUserId(userId);
  }

  async getAllProject(): Promise<Project[]> {
    return await this.projectModel.find();
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
    return await this.projectModel.find({ userId });
  }
}
