import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus, RequestType } from 'shared/enums/request.enum';

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  proof?: Express.Multer.File[];

  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty()
  @IsOptional()
  date?: string;
}

export class UpdateRequestDto {
  @ApiProperty({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty()
  @IsString()
  requestId: string;
}
