import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { ConfigService } from '@nestjs/config'
config()

const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  schema: configService.get<string>('DB_SCHEMA'),
  entities: ['**/*.entity{.ts,.js}'],
  migrations: ['migrations/*-migration.ts'],
  synchronize: false,
  migrationsRun: false,
  logging: true,
})
