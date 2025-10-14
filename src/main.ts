import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //EJS setup
  app.setBaseViewsDir(path.join(process.cwd(),'src','auth','mailer','templates'))
  app.setViewEngine('ejs')

  const config = new DocumentBuilder()
  .setTitle("NEST-CARE API")
  .setDescription("Api for minimalist hospital management system")
  .setVersion("1.0")
  .addBearerAuth({
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'Authorization',
    in:'header'
  }, 'jwt')
  .build()

  const document = SwaggerModule.createDocument(app,config)

  SwaggerModule.setup('api',app,document)


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
