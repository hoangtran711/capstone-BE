import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import {
  CreateProjectDto,
  RequestProgressProjects,
} from './dtos/projects-request.dto';
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
    description: 'Get Projects student joined successfully',
  })
  @ApiOperation({ summary: 'Get projects student joine of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser)
  @Get('/student/me')
  async getProjectStudentJoined() {
    const project = await this.projectsService.getProjectsJoinedOfStudent();
    return GenericResponse.success(project);
  }

  @ApiResponse({
    status: 200,
    description: 'Get Projects student joined successfully',
  })
  @ApiOperation({ summary: 'Get projects student joine of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.EndUser, RoleEnum.Admin)
  @Get('/detail/:projectId')
  async getProjectDetail(@Param('projectId') projectId: string) {
    const project = await this.projectsService.getProjectDetail(projectId);
    return GenericResponse.success(project);
  }

  @ApiResponse({
    status: 200,
    description: 'Get Projects successfully',
  })
  @ApiOperation({ summary: 'Get project of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/')
  async getAllProject() {
    const project = await this.projectsService.getAllProject();
    return GenericResponse.success(project);
  }

  @ApiResponse({
    status: 200,
    description: 'GET Progress projects successfully',
  })
  @ApiOperation({ summary: 'GET Progress projects successfully' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Post('/progress')
  async getProgressProjects(@Body() { projectIds }: RequestProgressProjects) {
    const progresses = await this.projectsService.getProgressOfProjects(
      projectIds,
    );
    return GenericResponse.success(progresses);
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
