import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('short_urls')
export class ShortUrlEntity {
  @PrimaryColumn('uuid', {
    primaryKeyConstraintName: 'pk_short_urls',
  })
  id: string

  @Column({
    name: 'full_url',
  })
  fullUrl: string

  @Column({
    name: 'short_code',
  })
  shortCode: string

  @Column({
    name: 'created_at',
  })
  createdAt: Date

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date
}
