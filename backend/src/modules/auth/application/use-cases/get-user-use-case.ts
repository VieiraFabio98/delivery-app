import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "@shared/helpers"
import { IUserRepository } from "@modules/auth/domain/repositories/i-user-repository"

@injectable()
class GetUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const user = await this.userRepository.findById(id)

      if (!user) {
        return notFound('Usuário não encontrado')
      }

      return found({ id: user.id, name: user.name, email: user.email })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { GetUserUseCase }
