import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateShortUrlCommand } from '../commands/create-short-url.command'

@Controller({
  version: '1',
  path: 'api/users',
})
export class ShortUrlController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(@Body() body: { name: string; phoneNumber: string }) {
    const { name, phoneNumber } = body
    return this.commandBus.execute(new CreateShortUrlCommand(name, phoneNumber))
  }
}
