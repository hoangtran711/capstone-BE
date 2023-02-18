import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import {
  RequestAttendaceDto,
  RequestJoinProjectDto,
  UpdateUserLeaveStatusDto,
} from './dtos/student-request.dto';

import { StudentService } from './student.service';

@ApiTags('Student')
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @ApiResponse({
    status: 201,
    description: 'Get schedule of user successfully',
  })
  @ApiOperation({ summary: 'Current User get all schedule' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Get('/me/schedules')
  async currentUserGetAllSchedule() {
    const user = await this.studentService.currentUserGetAllSchedule();
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 201,
    description: 'Get schedule of user successfully',
  })
  @ApiOperation({ summary: 'Current User get all schedule' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get('/:userId/schedules')
  async getAllScheduleOfSpecificUser(@Param('userId') userId: string) {
    const scheduleUser = await this.studentService.getAllScheduleOfStudent(
      userId,
    );
    return GenericResponse.success(scheduleUser);
  }

  @ApiResponse({
    status: 201,
    description: 'Join Project successfully',
  })
  @ApiBody({ type: RequestJoinProjectDto })
  @ApiOperation({ summary: 'Current User join project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Post('/me/join-project')
  async joinProject(@Body() { projectId }: RequestJoinProjectDto) {
    const user = await this.studentService.currentUserJoinProject(projectId);
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Join Project successfully',
  })
  @ApiBody({ type: RequestJoinProjectDto })
  @ApiOperation({ summary: 'Create Student in Project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Post('/:userId/join-project')
  async createUserInProject(
    @Param('userId') userId: string,
    @Body() { projectId }: RequestJoinProjectDto,
  ) {
    const user = await this.studentService.createUserJoinProject(
      projectId,
      userId,
    );
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 201,
    description: 'Attendance Project successfully',
  })
  @ApiBody({ type: RequestAttendaceDto })
  @ApiOperation({ summary: 'Attendance Project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Post('/me/attendance')
  async attendance(@Body() { projectId }: RequestAttendaceDto) {
    const userSchedule = await this.studentService.currentUserAttendance(
      projectId,
    );
    return GenericResponse.success(userSchedule);
  }

  @ApiResponse({
    status: 201,
    description: 'Attendance For specific user successfully',
  })
  @ApiBody({ type: UpdateUserLeaveStatusDto })
  @ApiOperation({ summary: 'Attendance Project' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Post('/:userId/attendance')
  async attendanceForUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserLeaveStatusDto,
  ) {
    const userSchedule = await this.studentService.updateLeaveStatus(
      userId,
      body,
    );
    return GenericResponse.success(userSchedule);
  }
}
