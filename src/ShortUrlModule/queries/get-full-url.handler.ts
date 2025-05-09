import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetFullUrlQuery } from './get-full-url.query'
import { ShortUrlRepository } from '../repositories/short-url.repository'

@QueryHandler(GetFullUrlQuery)
export class GetFullUrlHandler implements IQueryHandler<GetFullUrlQuery> {
  constructor(private readonly repo: ShortUrlRepository) {}

  async execute(query: GetFullUrlQuery): Promise<string | null> {
    const { shortCode } = query
    const shortUrlAggregate = await this.repo.findByShortCode(shortCode)

    if (!shortUrlAggregate) {
      return null
    }

    return shortUrlAggregate.fullUrl
  }
}
