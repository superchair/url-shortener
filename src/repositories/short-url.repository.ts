import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Column,
  Entity,
  EntityManager,
  PrimaryColumn,
  Repository,
} from 'typeorm'
import { ShortUrlAggregate } from '../aggregates/short-url.aggregate'

@Entity('users')
export class ShortUrlEntity {
  @PrimaryColumn('uuid')
  id: string | null

  @Column()
  name: string

  @Column({ length: 10 })
  phoneNumber: string
}

@Injectable()
export class ShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly repo: Repository<ShortUrlEntity>
  ) {}

  async save(
    user: ShortUrlAggregate,
    manager?: EntityManager
  ): Promise<ShortUrlAggregate> {
    const entity = new ShortUrlEntity()
    entity.id = user.getId()
    entity.name = user.getName()
    entity.phoneNumber = user.getPhoneNumber()
    const repo = manager ? manager.getRepository(ShortUrlEntity) : this.repo
    const createdEntity = await repo.save(entity)

    return user.rehydrate(
      createdEntity.id,
      createdEntity.name,
      createdEntity.phoneNumber
    )
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
