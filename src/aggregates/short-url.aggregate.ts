import { AggregateRoot } from '@nestjs/cqrs'

export class ShortUrlCreatedEvent {
  constructor(private readonly shortUrl: ShortUrlAggregate) {}
}

export class ShortUrlUpdatedEvent {
  constructor(private readonly shortUrl: ShortUrlAggregate) {}
}

export class ShortUrlDeletedEvent {
  constructor(private readonly shortUrl: ShortUrlAggregate) {}
}

export class ShortUrlAggregate extends AggregateRoot {
  private constructor(
    private id: string | null,
    private name: string,
    private phoneNumber: string
  ) {
    super()
  }

  rehydrate(id: string | null, name: string, phoneNumber: string): this {
    this.id = id
    this.name = name
    this.phoneNumber = phoneNumber
    return this
  }

  static create(
    id: string | null,
    name: string,
    phoneNumber: string
  ): ShortUrlAggregate {
    const shortUrlAggregate = new ShortUrlAggregate(id, name, phoneNumber)
    shortUrlAggregate.apply(new ShortUrlCreatedEvent(shortUrlAggregate))
    return shortUrlAggregate
  }

  changeId(newId: string | null) {
    // TODO: validate newId is UUID

    this.id = newId
    this.apply(new ShortUrlUpdatedEvent(this))
    return this
  }

  changeName(newName: string) {
    this.name = newName
    this.apply(new ShortUrlUpdatedEvent(this))
    return this
  }

  changePhoneNumber(newPhoneNumber: string) {
    if (!/^\d{10}$/.test(newPhoneNumber)) {
      throw new Error('Phone number must be 10 digits')
    }

    this.phoneNumber = newPhoneNumber
    this.apply(new ShortUrlUpdatedEvent(this))
    return this
  }

  delete() {
    this.apply(new ShortUrlDeletedEvent(this))
  }

  getId(): string | null {
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
