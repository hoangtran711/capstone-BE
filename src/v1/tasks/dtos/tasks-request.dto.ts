import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  files?: Express.Multer.File[];
}

export class SubmitTaskDto {
  @IsString()
  taskId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  files?: Express.Multer.File[];

  @IsString()
  comment: string;
}
