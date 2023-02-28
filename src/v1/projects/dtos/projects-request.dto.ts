import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  public projectName: string;

  @ApiProperty()
  public projectDescription: string;

  @ApiProperty()
  @IsDateString()
  public startDate: string;

  @ApiProperty()
  @IsDateString()
  public endDate: string;

  @ApiProperty()
  @IsArray()
  public learnDate: {
    time: string;
    location?: {
      lat: number;
      lng: number;
    };
  }[];

  @ApiProperty()
  @IsNumber()
  public attendanceAfterMinute: number;

  @ApiProperty()
  public maxJoin: number;

  @ApiProperty()
  public totalLesson: number;
}

export class RequestProgressProjects {
  projectIds: string[];
}
