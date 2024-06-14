import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class AppService {
  async getHello() {
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 690,
        height: 1990,
      },
    });
    const page = await browser.newPage();

    // await page.goto('https://juejin.cn/', { waitUntil: 'networkidle2' });
    await page.goto(
      'https://dev-uc.qstcloud.net/login?theme=athena&layout=eyJsYXlvdXRUeXBlIjoiZW50ZXJwcmlzZSJ9&redirect_uri=https://dev-athena.qstcloud.net/hr/login',
      {
        waitUntil: 'networkidle2',
      },
    );
    // await page.goto('https://www.baidu.com/');

    // await page.waitForNavigation({ timeout: 60000 });

    // 生成截图
    // const imgBuffer = await page.screenshot({ path: 'screenshot.png' });

    const el = await page.waitForSelector('#app');

    const imgBuffer = await el.screenshot();

    const testBuffer = await page.pdf({
      path: 'page.pdf',
      format: 'A4',
      printBackground: true,
    });

    console.log(testBuffer);

    // 关闭浏览器实例
    // await browser.close();

    // res.setHeader('Content-Type', 'application/octet-stream');
    // res.setHeader('Content-Disposition', 'attachment; filename=test.png'); // 替换为实际文件名和扩展名

    // 保存截图到服务器
    const fileName = `test_${Date.now()}.png`; // 设置文件名
    fs.writeFileSync(fileName, imgBuffer, {});

    return fileName;
  }

  async customHtml() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = `<html><body>
    <div id="custom" data-v-50da5b94="" class="training-card"><div data-v-50da5b94="" class="title-wrapper"><!----><!----><span data-v-50da5b94="" class="title">基于车辆特征分析的套牌车稽查系统</span></div><div data-v-50da5b94="" class="tag-name" title="青软产教融合研究院">青软产教融合研究院</div><div data-v-50da5b94="" class="poster-wrapper"><div data-v-50da5b94="" class="property-number">知识产权号：9787894306425</div><img data-v-50da5b94="" src="https://staticfile.eduplus.net/bf956caae03a4c7495c451bffbd9a4ed/picture/ff7de1087c8c4b1db44b2542a5d4a4bb.jpg" class="cover-img"></div><div data-v-50da5b94="" class="industry-wrapper"><div data-v-50da5b94="" class="industry" title="交通">交通</div></div><div data-v-50da5b94="" class="other-info"><div data-v-50da5b94="" class="left-info"><img data-v-50da5b94="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGMSURBVHgB7Zc7T8MwFIVPUclCMhAGwgrtAAxUrCBWEI8KEOJvggpFhQ1UEAKJxwAMDXPdoWEgDIQBfK1GQjQOTpo+pOYsSWRH9/O5vn5kvrnQR42gz8qGNd49POLp+QWe50FVmqZhfm4Wi4UFpf4ZWQqub25F8LjK52awsrz0bz+pAzX7VTx1fQyWZUFVjDG47of4v+k42FhbFa5EBvBtn+LBVUbi6911cVI5FRCO84Yyfw+DSHwSGrqOdR6QnCMRxEHpmAO56AmAD7FT3IJpjotvCl6unAVCdK0MyXKy/jfEefUSPQPwIcgJy5oU34w12vpkEUFNnk/ZmmDwnOvc+uA2HQyNwDZlALLwsHQU2me7uIkJ00QUKafgU2E1DKt3mZQdoJHt7+1Ky4mCG5IUJAJAogBxgoRpsHfDv4pbBYkApFWQVkG3lAIM7kJEs5oWnTrfwy+qV+hE9dY5IKhMpQB0tr/n9wIqu5ptIwnlc9NQBqCLBTlAwT3vC51I00Zbl5VCW1tm6O+GKcAPg9mfCo3jLY0AAAAASUVORK5CYII=" width="16" height="16"><div data-v-50da5b94="" class="num" style="margin: 0px 24px 0px 4px;">32</div><img data-v-50da5b94="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHdSURBVHgB7ZbbUcJAFIb/zVoAHZgS6MBYgb47CkF8twNjBTaASUR9twNiBVJC7CAFsDmezYWAQMwm+qDyzWR2wxx2f84VYM9/R8AQ358epQIeb/v89PiJQBSOR4MHtMBIwH3weEMgb/tB5F26g1sY0liA7z8MUiHC4jXh5wW5B05LG4vgjEYXrzDgoKlhKqwhQPmLkv3x+Oxdb4MgsBXkmxZThOYYBljNTckpNi/l5RrXdWORe0PThyEGAjK3r66VtDwUmh5+ToCYF5vTyeT5sPxUhwBVHkQwpHEOWCS9VCwi6F8pVTwJptrtiVpJQpAVwpDfU4Ylvv/E5UjDIikTHRrOgdsr9zzCnhbsDEHRYG7YwGEX2zCC5lnVKOmt9ozGAvTlKawZQdjoBMVQB06diK1luH65iLKDjNDf1UnKq1Qhatrzhgd46Jzw0Clbazh2L1y04D6Y3nHorvW+bkhtdEISomosHEO0xIJa9gQeUsPddp8FgIqBIuZfJVAdPKSSPBkzHDQVkMcvkxKjI6KaHz0DAUvjBN+HkYDyYhsdoQbjeUsZardlfd7hiTfjNUY7bFSxD9FUgMTCTSFntH5AF+K6atoIgf6LxSV0LHLVXfIgyZqYkk6Xatrz9/kAW6KsNBK7WQoAAAAASUVORK5CYII=" width="16" height="16"><div data-v-50da5b94="" class="num" style="margin-left: 4px;">519</div></div><div data-v-50da5b94="" class="direction" title="人工智能">人工智能</div></div></div>
    <style>
    .training-card[data-v-50da5b94] {
      width: 300px;
      height: 326px;
      cursor: pointer;
      background: #ffffff;
      box-shadow: 0 1px 20px #cad0d966;
      padding: 16px;
      border-radius: 8px;
  }

 .title-wrapper[data-v-50da5b94] {
    width: 100%;
    height: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.icon-wrapper[data-v-50da5b94] {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
    </style>
    </body></html>`;

    await page.setContent(html);

    const el = await page.waitForSelector('#custom');

    // 生成截图
    const imgBuffer = await el.screenshot();

    // 关闭浏览器实例
    await browser.close();

    // 保存截图到服务器
    const fileName = `test_${Date.now()}.png`; // 设置文件名
    fs.writeFileSync(fileName, imgBuffer);

    return fileName;
  }

  async template() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(path.resolve(__dirname, '..', 'template', 'index.hbs'));

    // return '';

    // 读取模板文件
    const template = fs.readFileSync(
      path.resolve(__dirname, '..', 'template', 'index2.hbs'),
      'utf8',
    );

    // 编译模板
    const compiledTemplate = Handlebars.compile(template);

    // 定义数据
    const data = {
      heading: 'Hello, Handlebars!',
      content:
        'This is a simple example of using Handlebars.This is a simple example of using Handlebars.',
      status: '31231',
      style:
        'width: 351px; height: 186px;background-image: url(https://staticfile.eduplus.net/qcard/default/qcard_240603_style1-bg1.png);background-size: 100% 100%; background-position: center;',
    };

    let html = '';
    // 渲染模板
    try {
      html = compiledTemplate(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    await page.setContent(html);

    const el = await page.waitForSelector('#custom');

    // 生成截图
    const imgBuffer = await el.screenshot({ type: 'jpeg', quality: 60 });

    const pdfBuffer = await page.pdf({
      path: 'page2.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        // 设置页边距
        top: '1cm', // 页眉需要额外的空间
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    });

    // 关闭浏览器实例
    await browser.close();

    // 保存截图到服务器
    const fileName = `test_${Date.now()}.png`; // 设置文件名
    const pdfFileName = `test_${Date.now()}.pdf`; // 设置文件名
    // fs.writeFileSync(fileName, imgBuffer);

    return { fileName, imgBuffer, pdfFileName, pdfBuffer };
  }
}
