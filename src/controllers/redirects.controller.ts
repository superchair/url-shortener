import {
  All,
  Controller,
  Logger,
  Param,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Response } from 'express'
import { GetFullUrlQuery } from '../ShortUrlModule/queries'

@Controller({
  version: VERSION_NEUTRAL,
  path: '',
})
export class RedirectsController {
  private readonly logger: Logger = new Logger(RedirectsController.name)

  constructor(private readonly queryBus: QueryBus) {}

  @All('/:shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response
  ): Promise<void> {
    this.logger.log(`Received redirect request for short code: ${shortCode}`)
    const fullUrl = await this.queryBus.execute(new GetFullUrlQuery(shortCode))
    if (!fullUrl) {
      res.status(404).send('Not Found')
      return
    }
    this.logger.log(`Redirecting to full URL: ${fullUrl}`)
    res.redirect(308, fullUrl)
  }
}
