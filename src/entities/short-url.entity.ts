import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('short_urls')
export class ShortUrlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
  })
  fullUrl: string

  @Column({
    unique: true,
  })
  shortCode: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}
