import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryFailedError, Repository } from 'typeorm'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'
import { ShortUrlEntity } from '../entities/short-url.entity'
import { IdCollisionError } from '../errors/id-collision.error'
import { ShortCodeCollisionError } from '../errors/short-code-collision.error'

@Injectable()
export class ShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly repo: Repository<ShortUrlEntity>
  ) {}

  async create(aggregate: ShortUrlAggregate): Promise<ShortUrlAggregate> {
    const entity = this.repo.create({
      id: aggregate.id,
      fullUrl: aggregate.fullUrl,
      shortCode: aggregate.shortCode,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    })

    try {
      await this.repo.insert(entity)
    } catch (error) {
      throw this.checkQueryError(entity, error)
    }
    aggregate.commit()
    return aggregate
  }

  async update(aggregate: ShortUrlAggregate): Promise<ShortUrlAggregate> {
    const entity = this.repo.create({
      id: aggregate.id,
      fullUrl: aggregate.fullUrl,
      shortCode: aggregate.shortCode,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    })

    try {
      await this.repo.save(entity)
    } catch (error) {
      throw this.checkQueryError(entity, error)
    }
    aggregate.commit()
    return aggregate
  }

  private checkQueryError(entity: ShortUrlEntity, error: any): any {
    if (error instanceof QueryFailedError) {
      const { code, detail } = error.driverError as {
        code?: string
        detail?: string
      }

      // Handle specific error codes based on the database
      if ('23505' === code) {
        if (detail?.includes('UQ_id')) {
          return new IdCollisionError(entity.id)
        } else if (detail?.includes('UQ_short_code')) {
          return new ShortCodeCollisionError(entity.id, entity.shortCode)
        }
      }
    }
    return error
  }

  async findById(id: string): Promise<ShortUrlAggregate | null> {
    const entity = await this.repo.findOne({ where: { id } })
    const aggregate = entity ? ShortUrlAggregate.fromEntity(entity) : null
    return aggregate
  }

  async findByShortCode(shortCode: string): Promise<ShortUrlAggregate | null> {
    const entity = await this.repo.findOne({ where: { shortCode } })
    const aggregate = entity ? ShortUrlAggregate.fromEntity(entity) : null
    return aggregate
  }

  async delete(aggregate: ShortUrlAggregate): Promise<void> {
    await this.repo.delete(aggregate.id)
    aggregate.flagDeleted().commit()
  }
}
