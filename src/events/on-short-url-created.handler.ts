import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from './short-url-created.event'
import { Logger } from '@nestjs/common'

@EventsHandler(ShortUrlCreatedEvent)
export class OnShortUrlCreatedHandler
  implements IEventHandler<ShortUrlCreatedEvent>
{
  private readonly logger = new Logger(OnShortUrlCreatedHandler.name)

  handle(event: ShortUrlCreatedEvent) {
    const shortUrl = event.shortUrl
    this.logger.log(
      `User created: id=${shortUrl.getId()}, name=${shortUrl.getName()}, phone=${shortUrl.getPhoneNumber()}`
    )
  }
}
