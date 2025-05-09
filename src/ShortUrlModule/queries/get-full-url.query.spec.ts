import { RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants'
import { GetFullUrlQuery } from './get-full-url.query'

describe('GetFullUrlQuery', () => {
  it('should create an instance of GetFullUrlQuery', () => {
    const shortCode = 'abc123'
    const query = new GetFullUrlQuery(shortCode)

    expect(query.shortCode).toEqual(shortCode)
    expect(query[RESULT_TYPE_SYMBOL]).toBeUndefined()
  })
})
