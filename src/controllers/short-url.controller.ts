import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { FullUrlDto } from '../dtos/full-urld.dto'
import { CreateShortUrlCommand, UpdateShortUrlCommand } from '../ShortUrlModule'

@Controller({
  version: '1',
  path: 'api/short-code',
})
export class ShortUrlController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: FullUrlDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateShortUrlCommand(body.fullUrl)
    )
  }

  @Put(':shortCode')
  async update(
    @Param(':shortCode') shortCode: string,
    @Body() body: FullUrlDto
  ) {
    await this.commandBus.execute(
      new UpdateShortUrlCommand(shortCode, body.fullUrl)
    )
  }
}
