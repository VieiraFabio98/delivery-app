import { DataSource } from 'typeorm'
import { getConfig } from './config'

export const AppDataSource = new DataSource(getConfig())
