import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { CreateShortUrlCommand } from './create-short-url.command'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'
import { customAlphabet } from 'nanoid'
import { IdCollisionError } from '../errors/id-collision.error'
import { ShortCodeCollisionError } from '../errors/short-code-collision.error'
import { Logger } from '@nestjs/common'

@CommandHandler(CreateShortUrlCommand)
export class CreateShortUrlHandler
  implements ICommandHandler<CreateShortUrlCommand>
{
  private readonly logger: Logger = new Logger(CreateShortUrlHandler.name)

  constructor(
    private readonly repo: ShortUrlRepository,
    private readonly publisher: EventPublisher
  ) {}

  async execute(command: CreateShortUrlCommand) {
    const { fullUrl } = command
    let retryCount = 0

    while (retryCount < 10) {
      try {
        const shortCode = this.generateShortCode(command.shortCodeLength)
        const shortUrlAggregate = this.publisher.mergeObjectContext(
          ShortUrlAggregate.create(fullUrl, shortCode)
        )
        this.logger.log(
          `Creating ShortUrl with full URL '${fullUrl}' and short code '${shortCode}'`
        )
        await this.repo.save(shortUrlAggregate)
        return shortUrlAggregate.shortCode
      } catch (error) {
        if (
          error instanceof IdCollisionError ||
          error instanceof ShortCodeCollisionError
        ) {
          retryCount++
          continue
        }

        // Re-throw other unexpected errors
        throw error
      }
    }
  }

  private generateShortCode(length: number = 6): string {
    const alphabet = '2356789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
    return customAlphabet(alphabet, length)()
  }
}
