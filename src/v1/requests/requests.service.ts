import { RoleEnum } from '@common/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from '@schemas/request.schema';
import { Model } from 'mongoose';
import { RequestStatus, RequestType } from 'shared/enums/request.enum';
import { ProjectsService } from 'v1/projects/projects.service';
import { StudentService } from 'v1/student/student.service';
import { UsersService } from 'v1/users/users.service';
import { CreateRequestDto, UpdateRequestDto } from './dtos/request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private projectsService: ProjectsService,
    private studentService: StudentService,
    private usersService: UsersService,
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
    @Inject(REQUEST) private request,
  ) {}

  async getAllRequest() {
    return await this.requestModel.find();
  }

  async getAllRequestByProjectId(projectId: string) {
    return await this.requestModel.findOne({ projectId });
  }

  async getDetailRequestById(requestId: string) {
    return await this.requestModel.findById(requestId);
  }

  async getAllRequestedCurrentUser() {
    const userId = this.request.user.id;
    const role = this.request.user.role;
    let requests;
    if (role === RoleEnum.Admin) {
      requests = await this.requestModel.find({ approver: userId }).lean();
    } else {
      requests = await this.requestModel.find({ userId }).lean();
    }
    const requestsInfo = [];
    for (const request of requests) {
      const userInfo = await this.usersService.findOne(request.userId);
      const approverInfo = await this.usersService.findOne(request.userId);
      const projectInfo = await this.projectsService.findOne(request.projectId);
      requestsInfo.push({ ...request, userInfo, approverInfo, projectInfo });
    }
    return requestsInfo;
  }
  async getRequestRequesterCurrentUser() {
    const userId = this.request.user.id;
    return await this.requestModel.find({ userId });
  }

  async updateStatusRequest({ status, requestId }: UpdateRequestDto) {
    const foundRequest = await this.requestModel.findById(requestId);
    if (
      foundRequest.type === RequestType.Join_Project &&
      status === RequestStatus.Accepted
    ) {
      await this.studentService.createJoinProjectForUserId(
        foundRequest.projectId,
        foundRequest.userId,
      );
    }
    foundRequest.status = status;
    return await foundRequest.save();
  }

  async createRequest({
    projectId,
    reason,
    proof,
    date,
    type,
  }: CreateRequestDto) {
    const proofPath = this.convertFileToImagePath(proof);
    const approver = await this.projectsService.getUserCreatedOfProject(
      projectId,
    );
    const request = await this.createRequestLocal(
      projectId,
      reason,
      date,
      type,
      approver,
      proofPath,
    );
    return request;
  }

  private convertFileToImagePath(files) {
    const baseUrl = 'http://localhost:3001/api/v1/uploads/';
    const path = [];
    for (const file of files) {
      path.push(baseUrl + file.filename);
    }
    return path;
  }

  private async createRequestLocal(
    projectId,
    reason,
    date,
    type,
    approver,
    proof,
  ) {
    const userId = this.request.user.id;
    const request = new this.requestModel({
      userId,
      projectId,
      reason,
      date,
      type,
      approver,
      proof,
      status: RequestStatus.Pending,
    });
    return await request.save();
  }
}
