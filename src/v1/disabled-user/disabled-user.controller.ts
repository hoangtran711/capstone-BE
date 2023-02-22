import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import { DisabledUserService } from './disabled-user.service';

@Controller('disabled-user')
@ApiTags('Disabled User')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisabledUserController {
  constructor(private disabledUserService: DisabledUserService) {}

  @ApiResponse({
    status: 200,
    description: 'GET students disabled successfully',
  })
  @ApiOperation({ summary: 'GET students disabled successfully' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get('/:projectId')
  async getAllStudentsDisabled(@Param('projectId') projectId: string) {
    const requests = await this.disabledUserService.getAllDisabledStudents(
      projectId,
    );
    return GenericResponse.success(requests);
  }

  @ApiResponse({
    status: 201,
    description: 'REMOVE students disabled successfully',
  })
  @ApiOperation({ summary: 'REMOVE students disabled successfully' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Post('/:projectId/remove/:userId')
  async removeStudentDisabled(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    const requests = await this.disabledUserService.removeStudentDisabled(
      projectId,
      userId,
    );
    return GenericResponse.success(requests);
  }
}
