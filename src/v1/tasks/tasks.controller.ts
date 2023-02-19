import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LIMIT_SIZE_FILE_UPLOAD } from 'constants/limit';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto, SubmitTaskDto } from './dtos/tasks-request.dto';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all tasks today of student successfully',
  })
  @ApiOperation({ summary: 'GET All tasks today of student id' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Get('/student/today')
  async getAllTasksTodayStatusStudent() {
    const requests = await this.tasksService.getTasksTodayOfCurrentUser();
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all tasks today of student successfully',
  })
  @ApiOperation({ summary: 'GET All tasks today of student id' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Get('/student/:projectId')
  async getAllTasksByProjectId(@Param('projectId') projectId: string) {
    const requests =
      await this.tasksService.getTasksTodayByProjectIdOfCurrentUser(projectId);
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all tasks created by teacher id  successfully',
  })
  @ApiOperation({ summary: 'GET All tasks created by teacher id' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get('/teacher/status')
  async getAllTasksStatusCreatedBy(@Req() req) {
    const userId = req.user.id;
    const requests = await this.tasksService.getTasksStatusOfTeacher(userId);
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all tasks created by teacher id  successfully',
  })
  @ApiOperation({ summary: 'GET All tasks created by teacher id' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/teacher')
  async getAllTasksCreatedBy(@Req() req) {
    const userId = req.user.id;
    const requests = await this.tasksService.getAllTaskCreatedByUser(userId);
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all task status successfully',
  })
  @ApiOperation({ summary: 'GET All task status of project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/:projectId/status')
  async getAllTasksStatus(@Param('projectId') projectId: string) {
    const requests = await this.tasksService.getTaskInProject(projectId);
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all tasks successfully',
  })
  @ApiOperation({ summary: 'GET All tasks of project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/:projectId')
  async getAllTasksOfProject(@Param('projectId') projectId: string) {
    const requests = await this.tasksService.getAllTasksOfProject(projectId);
    return GenericResponse.success(requests);
  }

  @Post('/create')
  @Roles(RoleEnum.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Create tasks successfully',
  })
  @ApiOperation({ summary: 'Current User create request' })
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const fileName = uuid();
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${fileName}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createTask(
    @Body()
    createDto: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    if (files) {
      this.verifyUploadFilesSize(files);
      createDto.files = files;
    }
    const request = await this.tasksService.createTask(createDto);
    return GenericResponse.success(request);
  }

  @Post('/submit')
  @Roles(RoleEnum.EndUser)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Submit task successfully',
  })
  @ApiOperation({ summary: 'Current User submit task' })
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const fileName = uuid();
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${fileName}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async submitTask(
    @Body()
    submitDto: SubmitTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    if (files) {
      this.verifyUploadFilesSize(files);
      submitDto.files = files;
    }
    const request = await this.tasksService.submitTask(submitDto);
    return GenericResponse.success(request);
  }

  private verifyUploadFilesSize(uploadFiles: Express.Multer.File[]) {
    for (const file of uploadFiles) {
      // only allow files < 5MB each
      if (file.size > LIMIT_SIZE_FILE_UPLOAD) {
        throw new UnprocessableEntityException(
          `File is too large: ${file.originalname} - ${file.size} bytes`,
        );
      }
    }
  }
}
