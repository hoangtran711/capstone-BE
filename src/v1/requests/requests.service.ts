import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from '@schemas/request.schema';
import { Model } from 'mongoose';
import { RequestStatus } from 'shared/enums/request.enum';
import { ProjectsService } from 'v1/projects/projects.service';
import { CreateRequestDto, UpdateRequestDto } from './dtos/request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private projectsService: ProjectsService,
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
    return await this.requestModel.find({ approver: userId });
  }

  async updateStatusRequest({ status, requestId }: UpdateRequestDto) {
    const foundRequest = await this.requestModel.findById(requestId);
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

    const userId = this.request.user.id;
    const request = new this.requestModel({
      userId,
      projectId,
      reason,
      date,
      type,
      approver,
      proof: proofPath,
      status: RequestStatus.Pending,
    });
    return request.save();
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
