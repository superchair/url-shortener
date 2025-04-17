import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('URL Shortener REST Service')
    .setDescription(
      'A service meant to minify URLs and provide redirects for them'
    )
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, documentFactory)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('APP_PORT') as number

  // start application
  await app.listen(port)
}
void bootstrap()
