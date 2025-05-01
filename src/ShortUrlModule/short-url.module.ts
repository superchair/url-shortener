import { Module } from '@nestjs/common'
import { CreateShortUrlHandler } from './commands/create-short-url.handler'
import { ShortUrlRepository } from './repositories/short-url.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortUrlEntity } from './entities/short-url.entity'
import { LogShortUrlChanged } from './events/log-short-url-changed.handler'
import { SendKafkaUrlCreated } from './events/send-kafka-url-created.handler'
import { UpdateShortUrlHandler } from './commands/update-short-url.handler'
import { GetFullUrlHandler } from './queries/get-full-url.handler'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ShortUrlEntity])],
  providers: [
    ShortUrlRepository,

    // command handlers
    CreateShortUrlHandler,
    UpdateShortUrlHandler,

    // query handlers
    GetFullUrlHandler,

    // event handlers
    LogShortUrlChanged,
    SendKafkaUrlCreated,
  ],
  exports: [CqrsModule],
})
export class ShortUrlModule {}
