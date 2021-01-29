import { BadRequestException, Body, Controller, Delete, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller('files')
export class FilesController {
  //   constructor(private filesService: FilesService) {}

  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  //   @ApiBody({
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         file: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   })
  //   @ApiConsumes('multipart/form-data')
  //   @UseInterceptors(FileInterceptor('file'))
  //   @Post('upload-single')
  //   async uploadSingleFile(@UploadedFile() file) {
  //       try{
  //           return await this.filesService.uploadPublicFile(file);
  //       }
  //       catch(error){
  //           throw new BadRequestException(error.message)
  //       }
  //   }

  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  //   @Delete('remove-single/:url')
  //   async removeSingleFile(@Res() res, @Param('url') url: string) {
  //     try{
  //         const s3Url = url.split('/')
  //         if(s3Url.length < 4){
  //           throw new BadRequestException('Not A Valid URL')
  //         }
  //         const key = s3Url.slice(3).join('/')
  //         await this.filesService.deletePublicFile(key);
  //         return res.status(HttpStatus.OK).json({
  //           message: "File Deleted Successfully",
  //           data: { url }
  //       })
  //     }
  //     catch(error){
  //         throw new BadRequestException(error.message)
  //     }
  // }
}
