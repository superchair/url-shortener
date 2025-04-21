import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from './short-url-created.event'
import { Logger } from '@nestjs/common'

@EventsHandler(ShortUrlCreatedEvent)
export class SendKafkaUrlCreated
  implements IEventHandler<ShortUrlCreatedEvent>
{
  private readonly logger = new Logger(SendKafkaUrlCreated.name)
  handle(event: ShortUrlCreatedEvent) {
    this.logger.log(
      `SEND TO KAFKA: URL created: id=${event.shortUrl.getId()}, name=${event.shortUrl.getName()}, phone=${event.shortUrl.getPhoneNumber()}`
    )
  }
}
