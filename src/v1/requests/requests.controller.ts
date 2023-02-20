import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LIMIT_SIZE_FILE_UPLOAD } from 'constants/limit';
import { CreateRequestDto, UpdateRequestDto } from './dtos/request.dto';
import { RequestsService } from './requests.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';

@Controller('requests')
@ApiTags('Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all requests successfully',
  })
  @ApiOperation({ summary: 'GET All requests of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get('/')
  async getAll() {
    const requests = await this.requestService.getAllRequest();
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all requests successfully',
  })
  @ApiOperation({ summary: 'GET All requests of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/me')
  async getAllCurrentUser() {
    const requests = await this.requestService.getAllRequestedCurrentUser();

    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all requests successfully',
  })
  @ApiOperation({ summary: 'GET All requests of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get(':projectId')
  async getAllByProjectId(@Param('projectId') projectId: string) {
    const requests = await this.requestService.getAllRequestByProjectId(
      projectId,
    );
    return GenericResponse.success(requests);
  }

  @Put('/me')
  @Roles(RoleEnum.Admin)
  @ApiResponse({
    status: 201,
    description: 'UPDATE request  successfully',
  })
  @ApiOperation({ summary: 'Current User UPDATE request' })
  @ApiBearerAuth()
  async updateStatusCurrentUser(
    @Body()
    updateDto: UpdateRequestDto,
  ) {
    const request = await this.requestService.updateStatusRequest(updateDto);
    return GenericResponse.success(request);
  }

  @Post('/me')
  @Roles(RoleEnum.EndUser)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Create request  successfully',
  })
  @ApiOperation({ summary: 'Current User create request' })
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('proof', 20, {
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
  async createForCurrentUser(
    @Body()
    createDto: CreateRequestDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    console.log(files);
    if (files) {
      this.verifyUploadFilesSize(files);
      createDto.proof = files;
    }
    const request = await this.requestService.createRequest(createDto);
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
