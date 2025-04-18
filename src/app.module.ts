import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ShortUrlController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RestAPIUtilities } from '@platform/rest-api-utils'
import { CreateShortUrlHandler } from './commands/create-short-url.handler'
import { ShortUrlRepository } from './repositories/short-url.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortUrlEntity } from './entities/short-url.entity'
import { OnShortUrlCreatedHandler } from './events/on-short-url-created.handler'

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    RestAPIUtilities.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        appName: configService.get<string>('APP_NAME'),
        buildNumber: 'UNKNOWN',
        buildVersion: 'UNKNOWN',
        appEnv: configService.get<string>('APP_ENV'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        schema: configService.get<string>('DB_SCHEMA'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([ShortUrlEntity]),
  ],
  controllers: [ShortUrlController],
  providers: [
    AppService,
    CreateShortUrlHandler,
    ShortUrlRepository,
    OnShortUrlCreatedHandler,
  ],
})
export class AppModule {}
