import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryFailedError, Repository } from 'typeorm'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'
import { ShortUrlEntity } from '../entities/short-url.entity'
import { IdCollisionError } from '../errors/id-collision.error'
import { ShortCodeCollisionError } from '../errors/short-code-collision.error'

@Injectable()
export class ShortUrlRepository {
  private readonly logger: Logger = new Logger(ShortUrlRepository.name)

  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly repo: Repository<ShortUrlEntity>
  ) {}

  async save(aggregate: ShortUrlAggregate): Promise<ShortUrlAggregate> {
    const entity = this.repo.create({
      id: aggregate.id,
      fullUrl: aggregate.fullUrl,
      shortCode: aggregate.shortCode,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    })

    try {
      this.logger.log(
        `Saving ShortUrl with full URL '${aggregate.fullUrl}' and short code '${aggregate.shortCode}'`
      )
      await this.repo.save(entity)
      this.logger.log(
        `ShortUrl with full URL '${aggregate.fullUrl}' and short code '${aggregate.shortCode}' saved successfully`
      )
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const errorCode = (error.driverError as { code?: string })?.code

        // Handle specific error codes based on the database
        if ('23505' === errorCode) {
          const detail =
            (error.driverError as { detail?: string })?.detail ?? ''

          if (detail.includes('UQ_id')) {
            throw new IdCollisionError(entity.id)
          } else if (detail.includes('UQ_short_code')) {
            throw new ShortCodeCollisionError(entity.id, entity.shortCode)
          }
        }
      }
      throw error
    }
    aggregate.commit()
    return aggregate
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
