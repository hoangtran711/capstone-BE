import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import { CreateProjectDto } from './dtos/projects-request.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@ApiTags('Projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiResponse({
    status: 200,
    description: 'Get Project successfully',
  })
  @ApiOperation({ summary: 'Get project of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get('/me')
  async getProjectCurrentUser() {
    const project = await this.projectsService.getProjectCurrentUser();
    return GenericResponse.success(project);
  }

  @ApiResponse({
    status: 200,
    description: 'Create Project successfully',
  })
  @ApiOperation({ summary: 'Create project of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Post('/me')
  async createProject(@Body() projectDto: CreateProjectDto) {
    const project = await this.projectsService.createProject(projectDto);
    return GenericResponse.success(project);
  }
}