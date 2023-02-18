import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import { ProjectJoinedService } from './project-joined.service';

@Controller('project-joined')
@ApiTags('Project Joined')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectJoinedController {
  constructor(private projectsJoinedService: ProjectJoinedService) {}

  @ApiResponse({
    status: 200,
    description: 'Get Student of Project successfully',
  })
  @ApiOperation({ summary: 'Get Student of Project successfully' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/:projectId')
  async getProjectCurrentUser(@Param('projectId') projectId: string) {
    const project = await this.projectsJoinedService.getStudentJoinedProject(
      projectId,
    );
    return GenericResponse.success(project);
  }
}
