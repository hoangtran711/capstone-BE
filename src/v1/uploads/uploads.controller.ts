import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('uploads')
@ApiTags('File Upload')
export class UploadsController {
  @ApiResponse({
    status: 200,
    description: 'GET file successfully',
  })
  @ApiOperation({ summary: 'GET file of system' })
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }
}
