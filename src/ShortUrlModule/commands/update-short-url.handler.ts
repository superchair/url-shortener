import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { UpdateShortUrlCommand } from './update-short-url.command'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

@CommandHandler(UpdateShortUrlCommand)
export class UpdateShortUrlHandler
  implements ICommandHandler<UpdateShortUrlCommand>
{
  constructor(
    private readonly repo: ShortUrlRepository,
    private readonly publisher: EventPublisher
  ) {}

  async execute(command: UpdateShortUrlCommand) {
    const { fullUrl, shortCode } = command
    let shortUrlAggregate: ShortUrlAggregate | null =
      await this.repo.findByShortCode(shortCode)

    if (!shortUrlAggregate) {
      throw new Error(`ShortUrl with short code '${shortCode}' not found`)
    }

    shortUrlAggregate = this.publisher.mergeObjectContext(shortUrlAggregate)
    shortUrlAggregate.changeUrl(fullUrl)
    await this.repo.update(shortUrlAggregate)
  }
}
