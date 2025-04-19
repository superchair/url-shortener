import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from './short-url-created.event'
import { Logger } from '@nestjs/common'
import { ShortUrlUpdatedEvent } from './short-url-updated.event'
import { ShortUrlDeletedEvent } from './short-url-deleted.event'

@EventsHandler(ShortUrlCreatedEvent, ShortUrlUpdatedEvent, ShortUrlDeletedEvent)
export class OnShortUrlChangedHandler
  implements
    IEventHandler<
      ShortUrlCreatedEvent | ShortUrlUpdatedEvent | ShortUrlDeletedEvent
    >
{
  private readonly logger = new Logger(OnShortUrlChangedHandler.name)

  handle(
    event: ShortUrlCreatedEvent | ShortUrlUpdatedEvent | ShortUrlDeletedEvent
  ) {
    switch (event.constructor) {
      case ShortUrlCreatedEvent:
        this.handleShortUrlCreatedEvent(event)
        break
      case ShortUrlUpdatedEvent:
        this.handleShortUrlUpdatedEvent(event)
        break
      case ShortUrlDeletedEvent:
        this.handleShortUrlDeletedEvent(event)
        break
      default:
        this.logger.error(
          `Unexpected event type: ${event.constructor.name}. This should never happen.`
        )
    }
  }

  private handleShortUrlCreatedEvent(event: ShortUrlCreatedEvent) {
    this.logger.log(
      `Short URL created: id=${event.shortUrl.getId()}, name=${event.shortUrl.getName()}, phone=${event.shortUrl.getPhoneNumber()}`
    )
  }

  private handleShortUrlUpdatedEvent(event: ShortUrlUpdatedEvent) {
    this.logger.log(
      `Short URL updated: id=${event.shortUrl.getId()}, name=${event.shortUrl.getName()}, phone=${event.shortUrl.getPhoneNumber()}`
    )
  }

  private handleShortUrlDeletedEvent(event: ShortUrlDeletedEvent) {
    this.logger.log(
      `Short URL deleted: id=${event.shortUrl.getId()}, name=${event.shortUrl.getName()}, phone=${event.shortUrl.getPhoneNumber()}`
    )
  }
}
