import { AggregateRoot } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from '../events/short-url-created.event'
import { ShortUrlUpdatedEvent } from '../events/short-url-updated.event'
import { ShortUrlDeletedEvent } from '../events/short-url-deleted.event'
import { ShortUrlEntity } from '../entities/short-url.entity'
import { v4 as uuidv4 } from 'uuid'

export class ShortUrlAggregate extends AggregateRoot {
  private constructor(
    public readonly id: string,
    private _fullUrl: string,
    public readonly shortCode: string,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {
    super()
  }

  static create(fullUrl: string, shortCode: string) {
    const id = uuidv4()
    const now = new Date()
    const aggregate = new ShortUrlAggregate(id, fullUrl, shortCode, now, now)
    aggregate.apply(new ShortUrlCreatedEvent(aggregate))
    return aggregate
  }

  static fromEntity(entity: ShortUrlEntity) {
    return new ShortUrlAggregate(
      entity.id,
      entity.fullUrl,
      entity.shortCode,
      entity.createdAt,
      entity.updatedAt
    )
  }

  changeUrl(newUrl: string): this {
    if (newUrl !== this.fullUrl) {
      this._fullUrl = newUrl
      this._updatedAt = new Date()
      this.apply(new ShortUrlUpdatedEvent(this))
    }
    return this
  }

  flagDeleted(): this {
    this.apply(new ShortUrlDeletedEvent(this))
    return this
  }

  get fullUrl(): string {
    return this._fullUrl
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}
