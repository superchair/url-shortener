import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

export class ShortUrlDeletedEvent {
  constructor(readonly shortUrl: ShortUrlAggregate) {}
}
