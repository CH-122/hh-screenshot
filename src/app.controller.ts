import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
// import * as path from 'path';
// import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() res: Response) {
    const fileName = await this.appService.getHello();
    return res.download(fileName);
  }
  @Get('custom')
  async customHtml(@Res() res: Response) {
    const fileName = await this.appService.customHtml();
    return res.download(fileName);
  }

  @Get('template')
  async template(@Res() res: Response) {
    try {
      const { fileName, imgBuffer } = await this.appService.template();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      res.send(imgBuffer);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    // res.download(fileName, () => {
    //   fs.unlink(fileName, (err) => {
    //     if (err) {
    //       console.error('删除文件出错', err);
    //     } else {
    //       console.log('文件删除成功');
    //     }
    //   });
    // });
  }
}
