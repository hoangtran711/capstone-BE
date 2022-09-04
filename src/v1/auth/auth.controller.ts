import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from 'pipes/validation.pipe';
import { AuthService } from './auth.service';
import { CreateStudentDTO } from './dtos/create-student.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  login(@Body(new ValidationPipe()) body: CreateStudentDTO) {
    this.authService.addUser(body);
  }
}
