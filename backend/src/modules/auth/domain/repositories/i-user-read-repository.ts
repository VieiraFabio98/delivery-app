import { IUser } from "../entities/i-user"

export interface IUserReadRepository {
  findByEmail(email: string): Promise<IUser | null>
  findById(id: string): Promise<IUser | null>
}
