import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ShortUrlController } from './controllers/app.controller'

@Module({
  imports: [],
  controllers: [ShortUrlController],
  providers: [AppService],
})
export class AppModule {}
