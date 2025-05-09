import { Test, TestingModule } from '@nestjs/testing'
import { ShortUrlRepository } from '../repositories/short-url.repository'
import { GetFullUrlHandler } from './get-full-url.handler'
import { GetFullUrlQuery } from './get-full-url.query'

describe('GetFullUrlHandler', () => {
  let module: TestingModule
  const mockSortUrlRepository = {
    findByShortCode: jest.fn(),
  }
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GetFullUrlHandler,
        {
          provide: ShortUrlRepository,
          useValue: mockSortUrlRepository,
        },
      ],
    }).compile()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    const handler = module.get<GetFullUrlHandler>(GetFullUrlHandler)
    expect(handler).toBeDefined()
  })

  it('should return null if no short URL is found', async () => {
    const handler = module.get<GetFullUrlHandler>(GetFullUrlHandler)
    const query = { shortCode: 'non-existing-code' } as GetFullUrlQuery
    mockSortUrlRepository.findByShortCode.mockResolvedValue(null)

    const result = await handler.execute(query)

    expect(result).toBeNull()
    expect(mockSortUrlRepository.findByShortCode).toHaveBeenCalledWith(
      query.shortCode
    )
  })

  it('should return the full URL if a short URL is found', async () => {
    const handler = module.get<GetFullUrlHandler>(GetFullUrlHandler)
    const query = { shortCode: 'existing-code' } as GetFullUrlQuery
    const mockShortUrlAggregate = {
      fullUrl: 'http://example.com',
    }
    mockSortUrlRepository.findByShortCode.mockResolvedValue(
      mockShortUrlAggregate
    )

    const result = await handler.execute(query)

    expect(result).toEqual(mockShortUrlAggregate.fullUrl)
    expect(mockSortUrlRepository.findByShortCode).toHaveBeenCalledWith(
      query.shortCode
    )
  })
})
