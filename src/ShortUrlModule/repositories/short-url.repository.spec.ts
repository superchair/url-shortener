import { Test, TestingModule } from '@nestjs/testing'
import { ShortUrlRepository } from './short-url.repository'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ShortUrlEntity } from '../entities/short-url.entity'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'
import { IdCollisionError } from '../errors/id-collision.error'
import { QueryFailedError } from 'typeorm'
import { ShortCodeCollisionError } from '../errors/short-code-collision.error'

describe('ShortUrlModule', () => {
  let module: TestingModule
  let shortUrlRepository: ShortUrlRepository

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ShortUrlRepository,
        {
          provide: getRepositoryToken(ShortUrlEntity),
          useValue: mockRepository,
        },
      ],
    }).compile()

    shortUrlRepository = module.get<ShortUrlRepository>(ShortUrlRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findById', () => {
    it('should return null if no entity is found', async () => {
      const id = 'non-existing-id'
      mockRepository.findOne.mockResolvedValue(null)

      const result = await shortUrlRepository.findById(id)

      expect(result).toBeNull()
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should return an aggregate if an entity is found', async () => {
      const id = 'existing-id'
      const entity = new ShortUrlEntity()
      entity.id = id
      entity.fullUrl = 'http://example.com'
      entity.shortCode = 'abc123'
      mockRepository.findOne.mockResolvedValue(entity)

      const result = await shortUrlRepository.findById(id)

      expect(result).toBeDefined()
      expect(result?.id).toEqual(id)
      expect(result?.fullUrl).toEqual(entity.fullUrl)
      expect(result?.shortCode).toEqual(entity.shortCode)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      })
    })
  })

  describe('findByShortCode', () => {
    it('should return null if no entity is found', async () => {
      const shortCode = 'non-existing-code'
      mockRepository.findOne.mockResolvedValue(null)

      const result = await shortUrlRepository.findByShortCode(shortCode)

      expect(result).toBeNull()
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode },
      })
    })

    it('should return an aggregate if an entity is found', async () => {
      const shortCode = 'existing-code'
      const entity = new ShortUrlEntity()
      entity.id = 'existing-id'
      entity.fullUrl = 'http://example.com'
      entity.shortCode = shortCode
      mockRepository.findOne.mockResolvedValue(entity)

      const result = await shortUrlRepository.findByShortCode(shortCode)

      expect(result).toBeDefined()
      expect(result?.shortCode).toEqual(shortCode)
      expect(result?.fullUrl).toEqual(entity.fullUrl)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode },
      })
    })
  })

  describe('delete', () => {
    it('should call delete method of the repository', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        _fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        _updatedAt: new Date(),
        flagDeleted: jest.fn(() => aggregate),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      const deleteSpy = jest.spyOn(aggregate, 'flagDeleted')
      const commitSpy = jest.spyOn(aggregate, 'commit')
      await shortUrlRepository.delete(aggregate)

      expect(mockRepository.delete).toHaveBeenCalledWith(aggregate.id)
      expect(deleteSpy).toHaveBeenCalled()
      expect(commitSpy).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create the aggregate and return it', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'new-id',
        fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      const commitSpy = jest.spyOn(aggregate, 'commit')

      mockRepository.create.mockReturnValue(aggregate)
      mockRepository.insert.mockResolvedValue(aggregate)

      const result = await shortUrlRepository.create(aggregate)

      expect(result).toEqual(aggregate)
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: aggregate.id,
        fullUrl: aggregate.fullUrl,
        shortCode: aggregate.shortCode,
        createdAt: aggregate.createdAt,
        updatedAt: aggregate.updatedAt,
      })
      expect(commitSpy).toHaveBeenCalled()
    })

    it('should throw an error if repository.insert fails', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        _fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        _updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      mockRepository.create.mockReturnValue(aggregate)

      const mockError = new Error('uhoh')
      mockRepository.insert.mockRejectedValue(mockError)

      try {
        await shortUrlRepository.create(aggregate)
      } catch (error) {
        expect(error).toEqual(mockError)
      }
    })
  })

  describe('update', () => {
    it('should update the aggregate and return it', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      const commitSpy = jest.spyOn(aggregate, 'commit')

      mockRepository.create.mockReturnValue(aggregate)
      mockRepository.save.mockResolvedValue(aggregate)

      const result = await shortUrlRepository.update(aggregate)

      expect(result).toEqual(aggregate)
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: aggregate.id,
        fullUrl: aggregate.fullUrl,
        shortCode: aggregate.shortCode,
        createdAt: aggregate.createdAt,
        updatedAt: aggregate.updatedAt,
      })
      expect(commitSpy).toHaveBeenCalled()
    })

    it('should throw an error if repository.update fails', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      mockRepository.create.mockReturnValue(aggregate)

      const mockError = new Error('uhoh')
      mockRepository.save.mockRejectedValue(mockError)

      try {
        await shortUrlRepository.update(aggregate)
      } catch (error) {
        expect(error).toEqual(mockError)
      }
    })
  })

  describe('checkQueryError', () => {
    it('should throw an error if there is an ID collision', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        _fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        _updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      mockRepository.create.mockReturnValue(aggregate)

      const query = 'query'
      const parameters = [aggregate.id]
      const driverError = new Error(
        'duplicate key value violates unique constraint "UQ_id"'
      ) as Error & {
        code: string
        detail: string
        constraint: string
      }
      driverError.code = '23505'
      driverError.detail = 'UQ_id'
      driverError.constraint = 'UQ_id'

      const mockQueryFailedError = new QueryFailedError(
        query,
        parameters,
        driverError
      )
      mockRepository.insert.mockRejectedValue(mockQueryFailedError)

      try {
        await shortUrlRepository.create(aggregate)
      } catch (error) {
        expect(error).toBeInstanceOf(IdCollisionError)
        expect((error as IdCollisionError).message).toEqual(
          `ID collision error: ${aggregate.id}`
        )
      }
    })

    it('should throw an error if there is a short code collision', async () => {
      const aggregate: ShortUrlAggregate = {
        id: 'existing-id',
        _fullUrl: 'http://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        _updatedAt: new Date(),
        commit: jest.fn(),
      } as unknown as ShortUrlAggregate

      mockRepository.create.mockReturnValue(aggregate)

      const query = 'query'
      const parameters = [aggregate.shortCode]
      const driverError = new Error(
        'duplicate key value violates unique constraint "UQ_short_code"'
      ) as Error & {
        code: string
        detail: string
        constraint: string
      }
      driverError.code = '23505'
      driverError.detail = 'UQ_short_code'
      driverError.constraint = 'UQ_short_code'

      const mockQueryFailedError = new QueryFailedError(
        query,
        parameters,
        driverError
      )
      mockRepository.insert.mockRejectedValue(mockQueryFailedError)

      try {
        await shortUrlRepository.create(aggregate)
      } catch (error) {
        expect(error).toBeInstanceOf(ShortCodeCollisionError)
        expect((error as ShortCodeCollisionError).message).toEqual(
          `Short code collision error on id ${aggregate.id}: ${aggregate.shortCode}`
        )
      }
    })
  })
})
