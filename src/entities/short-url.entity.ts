import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('short_urls')
export class ShortUrlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ length: 10 })
  phoneNumber: string
}
