import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { UserRepository } from '../repositories/short-url.repository'
import { CreateShortUrlCommand } from './create-short-url.command'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

@CommandHandler(CreateShortUrlCommand)
export class CreateShortUrlHandler
  implements ICommandHandler<CreateShortUrlCommand>
{
  constructor(
    private readonly repo: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateShortUrlCommand) {
    const user = await this.repo.save(
      ShortUrlAggregate.create(null, command.name, command.phoneNumber)
    )

    this.eventBus.publishAll(user.getUncommittedEvents())
    user.commit()

    return user
  }
}
