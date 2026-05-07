import { appDataSource } from "@database/data-source"
import { ICreateUserDTO } from "@modules/auth/application/dto/i-user-dto"
import { IUserRepository } from "@modules/auth/domain/repositories/i-user-repository"
import { IUser } from "@modules/auth/domain/entities/i-user"
import { Repository } from "typeorm"
import { User } from "../entities/User"

class UserRepository implements IUserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = appDataSource.getRepository(User)
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      return this.repository.findOne({ where: { id } })
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return this.repository.findOne({ where: { email } })
    } catch (error) {
      throw error
    }
  }

  async create(data: ICreateUserDTO): Promise<IUser> {
    try {
      const user = this.repository.create(data)
      return this.repository.save(user)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch (error) {
      throw error
    }
  }
}

export { UserRepository }
