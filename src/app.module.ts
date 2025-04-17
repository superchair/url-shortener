import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ShortUrlController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RestAPIUtilities } from '@platform/rest-api-utils'
import { CreateShortUrlHandler } from './commands/create-short-url.handler'
import { ShortUrlEntity, ShortUrlRepository } from './repositories/short-url.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'passwd',
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([ShortUrlEntity]),
  ],
  controllers: [ShortUrlController],
  providers: [AppService, CreateShortUrlHandler, ShortUrlRepository],
})
export class AppModule {}
