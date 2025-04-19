import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'
import { ShortUrlEntity } from '../entities/short-url.entity'

@Injectable()
export class ShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly repo: Repository<ShortUrlEntity>
  ) {}

  async insert(
    newShortUrl: {
      name: string
      phoneNumber: string
    },
    manager?: EntityManager
  ): Promise<ShortUrlAggregate> {
    const entity = new ShortUrlEntity()
    entity.name = newShortUrl.name
    entity.phoneNumber = newShortUrl.phoneNumber

    const repo = manager ? manager.getRepository(ShortUrlEntity) : this.repo
    const createdEntity = await repo.save(entity)

    return ShortUrlAggregate.create(
      createdEntity.id,
      createdEntity.name,
      createdEntity.phoneNumber
    )
  }

  async update(
    shortUrlAggregate: ShortUrlAggregate,
    manager?: EntityManager
  ): Promise<ShortUrlAggregate> {
    const entity = new ShortUrlEntity()
    entity.id = shortUrlAggregate.getId()
    entity.name = shortUrlAggregate.getName()
    entity.phoneNumber = shortUrlAggregate.getPhoneNumber()
    const repo = manager ? manager.getRepository(ShortUrlEntity) : this.repo
    const createdEntity = await repo.save(entity)
    return shortUrlAggregate
      .changeName(createdEntity.name)
      .changePhoneNumber(createdEntity.phoneNumber)
  }

  async findById(id: string): Promise<ShortUrlAggregate | null> {
    const entity = await this.repo.findOne({ where: { id } })
    return entity
      ? ShortUrlAggregate.create(entity.id, entity.name, entity.phoneNumber)
      : null
  }

  async delete(id: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ShortUrlEntity) : this.repo
    await repo.delete(id)
  }
}
