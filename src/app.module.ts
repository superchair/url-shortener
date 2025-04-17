import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ShortUrlController } from './controllers/app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RestAPIUtilities } from '@platform/rest-api-utils'

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
  ],
  controllers: [ShortUrlController],
  providers: [AppService],
})
export class AppModule {}
