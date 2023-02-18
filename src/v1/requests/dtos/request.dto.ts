import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus, RequestType } from 'shared/enums/request.enum';

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  proof?: Express.Multer.File[];

  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty()
  @IsDateString()
  date: string;
}

export class UpdateRequestDto {
  @ApiProperty({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty()
  @IsString()
  requestId: string;
}
