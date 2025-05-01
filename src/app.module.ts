import { Module } from '@nestjs/common'
import { ShortUrlController } from './controllers/short-url.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RestAPIUtilities } from '@platform/rest-api-utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortUrlModule } from './ShortUrlModule'
import { RedirectsController } from './controllers/redirects.controller'

@Module({
  imports: [
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
    ShortUrlModule,
  ],
  controllers: [ShortUrlController, RedirectsController],
})
export class AppModule {}
