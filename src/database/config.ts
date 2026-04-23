import { DataSourceOptions } from 'typeorm'

export const getConfig = (): DataSourceOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: ['src/entities/*.ts'],
})
