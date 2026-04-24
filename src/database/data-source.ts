import { DataSource } from 'typeorm'
import { getConfig } from './config'

export const appDataSource = new DataSource(getConfig())
