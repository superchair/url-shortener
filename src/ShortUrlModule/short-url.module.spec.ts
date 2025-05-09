import { Test, TestingModule } from '@nestjs/testing'
import { ShortUrlModule } from './short-url.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ShortUrlEntity } from './entities/short-url.entity'
import { CqrsModule } from '@nestjs/cqrs'
import { UpdateShortUrlHandler } from './commands/update-short-url.handler'
import { GetFullUrlHandler } from './queries/get-full-url.handler'
import { LogShortUrlChanged } from './events/log-short-url-changed.handler'
import { CreateShortUrlHandler } from './commands/create-short-url.handler'

describe('ShortUrlModule', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ShortUrlModule],
    })
      .overrideProvider(getRepositoryToken(ShortUrlEntity))
      .useValue({
        find: jest.fn(),
        save: jest.fn(),
      })
      .compile()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(module).toBeDefined()
  })

  it('should have dependencies defined', () => {
    const cqrsModule = module.get<CqrsModule>(CqrsModule)

    const createShortUrlHandler = module.get<CreateShortUrlHandler>(
      CreateShortUrlHandler
    )
    const updateShortUrlHandler = module.get<UpdateShortUrlHandler>(
      UpdateShortUrlHandler
    )
    const getFullUrlHandler = module.get<GetFullUrlHandler>(GetFullUrlHandler)
    const logShortUrlChanged =
      module.get<LogShortUrlChanged>(LogShortUrlChanged)

    expect(cqrsModule).toBeDefined()
    expect(createShortUrlHandler).toBeDefined()
    expect(updateShortUrlHandler).toBeDefined()
    expect(getFullUrlHandler).toBeDefined()
    expect(logShortUrlChanged).toBeDefined()
  })
})
