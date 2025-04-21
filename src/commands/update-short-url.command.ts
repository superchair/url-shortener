import { FullUrlDto } from '../dtos/full-urld.dto'

export class UpdateShortUrlCommand {
  constructor(
    public readonly shortCode: string,
    public readonly fullUrlDto: FullUrlDto
  ) {}
}
