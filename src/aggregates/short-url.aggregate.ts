import { AggregateRoot } from '@nestjs/cqrs'
import { ShortUrlCreatedEvent } from '../events/short-url-created.event'

export class ShortUrlUpdatedEvent {
  constructor(private readonly shortUrl: ShortUrlAggregate) {}
}

export class ShortUrlDeletedEvent {
  constructor(private readonly shortUrl: ShortUrlAggregate) {}
}

export class ShortUrlAggregate extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private name: string,
    private phoneNumber: string
  ) {
    super()
  }

  static create(
    id: string,
    name: string,
    phoneNumber: string
  ): ShortUrlAggregate {
    const shortUrlAggregate = new ShortUrlAggregate(id, name, phoneNumber)
    shortUrlAggregate.apply(new ShortUrlCreatedEvent(shortUrlAggregate))
    return shortUrlAggregate
  }

  changeName(newName: string): this {
    if (newName !== this.name) {
      this.name = newName
      this.apply(new ShortUrlUpdatedEvent(this))
    }
    return this
  }

  changePhoneNumber(newPhoneNumber: string): this {
    if (!/^\d{10}$/.test(newPhoneNumber)) {
      throw new Error('Phone number must be 10 digits')
    }

    if (newPhoneNumber !== this.phoneNumber) {
      this.phoneNumber = newPhoneNumber
      this.apply(new ShortUrlUpdatedEvent(this))
    }
    return this
  }

  delete() {
    this.apply(new ShortUrlDeletedEvent(this))
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getPhoneNumber(): string {
    return this.phoneNumber
  }

  private isNewUncommitted(): boolean {
    return (
      this.getUncommittedEvents().filter(
        (event) => event instanceof ShortUrlCreatedEvent
      ).length > 0
    )
  }
}
