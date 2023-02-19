import { ErrorMessage } from '@common/exception';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '@schemas/task-schema';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ProjectJoinedService } from 'v1/project-joined/project-joined.service';
import { CreateTaskDto, SubmitTaskDto } from './dtos/tasks-request.dto';

@Injectable()
export class TasksService {
  constructor(
    private projectJoinedService: ProjectJoinedService,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @Inject(REQUEST) private request,
  ) {}

  async getAllTasksOfProject(projectId: string) {
    return await this.taskModel.find({ projectId });
  }

  async getTaskInProject(projectId: string) {
    const now = new Date();
    const tasks = await this.taskModel.find({ projectId });
    const taskInprogress = tasks.filter((task) =>
      moment(now).isBetween(moment(task.startTime), moment(task.endTime)),
    );
    const taskPending = tasks.filter((task) =>
      moment(now).isAfter(task.endTime),
    );
    const taskCompleted = tasks.filter((task) =>
      moment(now).isBefore(task.startTime),
    );
    return {
      taskCompleted,
      taskInprogress,
      taskPending,
    };
  }

  async getAllTaskCreatedByUser(userId: string) {
    return await this.taskModel.find({ userId });
  }

  async getTasksStatusOfTeacher(userId: string) {
    const now = new Date();
    const tasks = await this.taskModel.find({ createdBy: userId });
    const taskInprogress = tasks.filter((task) =>
      moment(now).isBetween(moment(task.startTime), moment(task.endTime)),
    );
    const taskPending = tasks.filter((task) =>
      moment(now).isAfter(task.endTime),
    );
    const taskCompleted = tasks.filter((task) =>
      moment(now).isBefore(task.startTime),
    );
    return {
      taskInprogress,
      taskCompleted,
      taskPending,
    };
  }

  async getTasksStatusOfUser(userId: string) {
    const now = new Date();
    const tasks = await this.taskModel.find({ userId });
    const taskInprogress = tasks.filter((task) =>
      moment(now).isBetween(moment(task.startTime), moment(task.endTime)),
    );
    const taskPending = tasks.filter((task) =>
      moment(now).isAfter(task.endTime),
    );
    const taskCompleted = tasks.filter((task) =>
      moment(now).isBefore(task.startTime),
    );
    return {
      taskInprogress,
      taskCompleted,
      taskPending,
    };
  }

  async getTasksTodayByProjectIdOfCurrentUser(projectId: string) {
    const userId = this.request.user.id;
    const now = new Date();
    const foundTaskProject = await this.taskModel.find({ projectId });
    const tasks = [];
    for (const task of foundTaskProject) {
      const isJoinedProject =
        await this.projectJoinedService.checkIfUserJoinedProject(
          task.projectId,
          userId,
        );
      const taskBetweenStartEnd = moment(now).isBetween(
        moment(task.startTime),
        moment(task.endTime),
      );
      const isSumitted = task.submmited.find(
        (submit) => submit.userId === userId,
      );

      if (isJoinedProject && taskBetweenStartEnd) {
        tasks.push({
          submmited: task.submmited,
          files: task.files,
          title: task.title,
          description: task.description,
          startTime: task.startTime,
          endTime: task.endTime,
          createdBy: task.createdBy,
          isSubmited: !!isSumitted,
        });
      }
    }

    return tasks;
  }

  async getTasksTodayOfCurrentUser() {
    const userId = this.request.user.id;
    const now = new Date();
    const foundTaskProject = await this.taskModel.find();
    const tasks = [];
    for (const task of foundTaskProject) {
      const isJoinedProject =
        await this.projectJoinedService.checkIfUserJoinedProject(
          task.projectId,
          userId,
        );
      const taskBetweenStartEnd = moment(now).isBetween(
        moment(task.startTime),
        moment(task.endTime),
      );
      const isSumitted = task.submmited.find(
        (submit) => submit.userId === userId,
      );

      if (isJoinedProject && taskBetweenStartEnd) {
        tasks.push({
          submmited: task.submmited,
          files: task.files,
          title: task.title,
          description: task.description,
          startTime: task.startTime,
          endTime: task.endTime,
          createdBy: task.createdBy,
          isSubmited: !!isSumitted,
          _id: task._id,
        });
      }
    }

    return tasks;
  }

  async createTask(createDto: CreateTaskDto) {
    const userId = this.request.user.id;
    const filesPath = this.convertFileToImagePath(createDto.files);
    const newTask = new this.taskModel({
      ...createDto,
      submited: [],
      files: filesPath,
      createdBy: userId,
    });
    return await newTask.save();
  }

  async submitTask({ files, comment, taskId }: SubmitTaskDto) {
    const userId = this.request.user.id;
    const filesPath = this.convertFileToImagePath(files);
    const foundTask = await this.taskModel.findById(taskId);
    if (!foundTask) {
      throw new BadRequestException(ErrorMessage.Task_NotFound);
    }
    const taskSubmmitted = [...foundTask.submmited];
    const isSubmitted = taskSubmmitted.find(
      (submitted) => submitted.userId === userId,
    );
    if (isSubmitted) {
      throw new BadRequestException(ErrorMessage.Task_AlreadySubmitted);
    }
    taskSubmmitted.push({
      userId,
      createAt: new Date().toISOString(),
      files: filesPath,
      comment,
    });
    foundTask.submmited = taskSubmmitted;
    return await foundTask.save();
  }

  private convertFileToImagePath(files) {
    const baseUrl = 'http://localhost:3001/api/v1/uploads/';
    const path = [];
    for (const file of files) {
      path.push(baseUrl + file.filename);
    }
    return path;
  }
}
