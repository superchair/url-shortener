import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { UpdateShortUrlCommand } from './update-short-url.command'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

@CommandHandler(UpdateShortUrlCommand)
export class UpdateShortUrlHandler
  implements ICommandHandler<UpdateShortUrlCommand>
{
  constructor(
    private readonly repo: ShortUrlRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: UpdateShortUrlCommand) {
    const { fullUrlDto: shortUrlDto } = command
    const shortUrlAggregate: ShortUrlAggregate | null =
      await this.repo.findByShortUrl(shortUrlDto)
    if (!shortUrlAggregate) {
      throw new Error(`ShortUrl with id ${shortUrlId} not found`)
    }

    shortUrlAggregate
      .changeName(shortUrlDto.name)
      .changePhoneNumber(shortUrlDto.phoneNumber)

    const updatedShortUrlAggregate = await this.repo.update(shortUrlAggregate)

    this.eventBus.publishAll(updatedShortUrlAggregate.getUncommittedEvents())
    updatedShortUrlAggregate.commit()

    return updatedShortUrlAggregate
  }
}
