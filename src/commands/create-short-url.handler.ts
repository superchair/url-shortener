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
    const shortUrl = await this.repo.insert({
      name: command.name,
      phoneNumber: command.phoneNumber,
    })

    this.eventBus.publishAll(shortUrl.getUncommittedEvents())
    shortUrl.commit()

    return shortUrl
  }
}
