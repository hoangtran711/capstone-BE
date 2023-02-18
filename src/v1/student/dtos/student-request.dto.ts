import { ApiProperty } from '@nestjs/swagger';
import { LeaveStatus } from 'shared/enums/leave.enum';

export class RequestJoinProjectDto {
  @ApiProperty()
  projectId: string;
}

export class RequestAttendaceDto extends RequestJoinProjectDto {}

export class UpdateUserLeaveStatusDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  status: LeaveStatus;

  @ApiProperty({})
  indexOfTime: number;
}
