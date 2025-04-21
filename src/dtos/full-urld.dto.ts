import { ApiProperty } from '@nestjs/swagger'

export class FullUrlDto {
  @ApiProperty()
  fullUrl: string
}
