import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { CreateShortUrlCommand } from './create-short-url.command'

@CommandHandler(CreateShortUrlCommand)
export class CreateShortUrlHandler
  implements ICommandHandler<CreateShortUrlCommand>
{
  constructor(
    private readonly repo: ShortUrlRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateShortUrlCommand) {
    const { fullUrl } = command.fullUrlDto
    const shortCode = 'abcdefgh' // TODO: Generate a unique short code
    const shortUrlAggregate = await this.repo.insert({
      fullUrl,
      shortCode,
    })

    this.eventBus.publishAll(shortUrlAggregate.getUncommittedEvents())
    shortUrlAggregate.commit()

    return shortUrlAggregate
  }
}
