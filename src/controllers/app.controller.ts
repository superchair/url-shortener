import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateShortUrlCommand } from '../commands/create-short-url.command'
import { ApiProperty } from '@nestjs/swagger'

class CreateShortUrlBody {
  @ApiProperty()
  name: string

  @ApiProperty()
  phoneNumber: string
}

@Controller({
  version: '1',
  path: 'api/users',
})
export class ShortUrlController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(@Body() body: CreateShortUrlBody) {
    const { name, phoneNumber } = body
    return this.commandBus.execute(new CreateShortUrlCommand(name, phoneNumber))
  }
}
