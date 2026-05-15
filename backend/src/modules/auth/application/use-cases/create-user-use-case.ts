import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IUserRepository } from "@modules/auth/domain/repositories/i-user-repository"
import { ICreateUserDTO } from "@modules/auth/application/dto/i-user-dto"
import { hash } from "bcrypt"

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(data: ICreateUserDTO): Promise<HttpResponse> {
    try {
      const passwordHash = await hash(data.password, 10)

      const user = await this.userRepository.create({
        name: data.name,
        email: data.email,
        password: passwordHash,
      })

      return created(user)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { CreateUserUseCase }
