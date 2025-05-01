import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetFullUrlQuery } from './get-full-url.query'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { Logger } from '@nestjs/common'

@QueryHandler(GetFullUrlQuery)
export class GetFullUrlHandler implements IQueryHandler<GetFullUrlQuery> {
  private readonly logger: Logger = new Logger(GetFullUrlHandler.name)

  constructor(private readonly repo: ShortUrlRepository) {}

  async execute(query: GetFullUrlQuery): Promise<string | null> {
    const { shortCode } = query
    const shortUrlAggregate = await this.repo.findByShortCode(shortCode)

    if (!shortUrlAggregate) {
      this.logger.warn(`ShortUrl with short code '${shortCode}' not found`)
      return null
    }

    return shortUrlAggregate.fullUrl
  }
}
