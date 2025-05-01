import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

export class ShortUrlUpdatedEvent {
  constructor(readonly shortUrl: ShortUrlAggregate) {}
}
