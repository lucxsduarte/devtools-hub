import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.text({ type: 'text/plain' }));

  const config = new DocumentBuilder()
    .setTitle('DevTools Hub API')
    .setDescription('API centralizada de ferramentas para desenvolvedores')
    .setVersion('1.0')
    .addTag('Generators', 'Ferramentas que criam dados (CPF, CNPJ, etc...)')
    .addTag(
      'Formatters',
      'Ferramentas que transformam dados (JSON, XML, etc...)',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
