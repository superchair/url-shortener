import { Query } from '@nestjs/cqrs'
import { RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants'

export class GetFullUrlQuery implements Query<string | null> {
  [RESULT_TYPE_SYMBOL]: string | null
  constructor(readonly shortCode: string) {}
}
