import { ApiProperty } from '@nestjs/swagger';

export class RequestJoinProjectDto {
  @ApiProperty()
  projectId: string;
}
