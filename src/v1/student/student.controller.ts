import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import { RequestJoinProjectDto } from './dtos/student-request.dto';

import { StudentService } from './student.service';

@ApiTags('Student')
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private studentService: StudentService) {}
  @ApiResponse({
    status: 200,
    description: 'GET detail me successfully',
  })
  @ApiBody({ type: RequestJoinProjectDto })
  @ApiOperation({ summary: 'GET Detail of users' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Post('/me')
  async joinProject(@Body() body: RequestJoinProjectDto) {
    const user = await this.studentService.joinProject(body);
    return GenericResponse.success(user);
  }
}
