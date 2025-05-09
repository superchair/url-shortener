import { Test, TestingModule } from '@nestjs/testing'
import { ShortUrlCreatedEvent } from './short-url-created.event'
import { ShortUrlUpdatedEvent } from './short-url-updated.event'
import { ShortUrlDeletedEvent } from './short-url-deleted.event'
import { LogShortUrlChanged } from './log-short-url-changed.handler'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

describe('LogShortUrlChanged', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [LogShortUrlChanged],
    }).compile()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle ShortUrlCreatedEvent', () => {
    const handler = module.get<LogShortUrlChanged>(LogShortUrlChanged)
    const event = new ShortUrlCreatedEvent({
      id: '1',
      shortCode: 'shortCode',
      fullUrl: 'http://example.com',
    } as ShortUrlAggregate)

    const logSpy = jest.spyOn(handler['logger'], 'log')

    handler.handle(event)

    expect(logSpy).toHaveBeenCalledWith(
      `Short URL created: id=1, url=http://example.com, short code=shortCode`
    )
  })

  it('should handle ShortUrlUpdatedEvent', () => {
    const handler = module.get<LogShortUrlChanged>(LogShortUrlChanged)
    const event = new ShortUrlUpdatedEvent({
      id: '1',
      shortCode: 'shortCode',
      fullUrl: 'http://example.com',
    } as ShortUrlAggregate)

    const logSpy = jest.spyOn(handler['logger'], 'log')

    handler.handle(event)

    expect(logSpy).toHaveBeenCalledWith(
      `Short URL updated: id=1, url=http://example.com, short code=shortCode`
    )
  })

  it('should handle ShortUrlDeletedEvent', () => {
    const handler = module.get<LogShortUrlChanged>(LogShortUrlChanged)
    const event = new ShortUrlDeletedEvent({
      id: '1',
      shortCode: 'shortCode',
      fullUrl: 'http://example.com',
    } as ShortUrlAggregate)

    const logSpy = jest.spyOn(handler['logger'], 'log')

    handler.handle(event)

    expect(logSpy).toHaveBeenCalledWith(
      `Short URL deleted: id=1, url=http://example.com, short code=shortCode`
    )
  })
})
