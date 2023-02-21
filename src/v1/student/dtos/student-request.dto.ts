import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LeaveStatus } from 'shared/enums/leave.enum';

export class RequestJoinProjectDto {
  @ApiProperty()
  projectId: string;
}

export class RequestAttendaceDto extends RequestJoinProjectDto {
  @ApiProperty()
  @IsString()
  geoLocation: string;
}

export class UpdateUserLeaveStatusDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  status: LeaveStatus;

  @ApiProperty({})
  indexOfTime: number;
}
