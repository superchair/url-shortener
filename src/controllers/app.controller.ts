import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateShortUrlCommand } from '../commands/create-short-url.command'
import { FullUrlDto } from '../dtos/full-urld.dto'
import { UpdateShortUrlCommand } from '../commands/update-short-url.command'

@Controller({
  version: '1',
  path: 'api/users',
})
export class ShortUrlController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(@Body() body: FullUrlDto) {
    return this.commandBus.execute(new CreateShortUrlCommand(body))
  }

  @Put(':shortCode')
  update(@Param(':shortCode') shortCode: string, @Body() body: FullUrlDto) {
    return this.commandBus.execute(new UpdateShortUrlCommand(shortCode, body))
  }
}
