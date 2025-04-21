import { FullUrlDto } from '../dtos/full-urld.dto'

export class CreateShortUrlCommand {
  constructor(public readonly fullUrlDto: FullUrlDto) {}
}
