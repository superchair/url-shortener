import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

export class ShortUrlCreatedEvent {
  constructor(readonly shortUrl: ShortUrlAggregate) {}
}
