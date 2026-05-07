import { ICreateUserDTO } from "@modules/auth/application/dto/i-user-dto"
import { IUser } from "../entities/i-user"

export interface IUserWriteRepository {
  create(data: ICreateUserDTO): Promise<IUser>
  delete(id: string): Promise<void>
}
