import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from './short-url-created.event'
import { Logger } from '@nestjs/common'
import { ShortUrlUpdatedEvent } from './short-url-updated.event'
import { ShortUrlDeletedEvent } from './short-url-deleted.event'

@EventsHandler(ShortUrlCreatedEvent, ShortUrlUpdatedEvent, ShortUrlDeletedEvent)
export class LogShortUrlChanged
  implements
    IEventHandler<
      ShortUrlCreatedEvent | ShortUrlUpdatedEvent | ShortUrlDeletedEvent
    >
{
  private readonly logger = new Logger(LogShortUrlChanged.name)

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
    const { id, shortCode, fullUrl } = event.shortUrl
    this.logger.log(
      `Short URL created: id=${id}, url=${fullUrl}, short code=${shortCode}`
    )
  }

  private handleShortUrlUpdatedEvent(event: ShortUrlUpdatedEvent) {
    const { id, shortCode, fullUrl } = event.shortUrl
    this.logger.log(
      `Short URL updated: id=${id}, url=${fullUrl}, short code=${shortCode}`
    )
  }

  private handleShortUrlDeletedEvent(event: ShortUrlDeletedEvent) {
    const { id, shortCode, fullUrl } = event.shortUrl
    this.logger.log(
      `Short URL deleted: id=${id}, url=${fullUrl}, short code=${shortCode}`
    )
  }
}
