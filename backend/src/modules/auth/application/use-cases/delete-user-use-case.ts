import { inject, injectable } from "tsyringe"
import { noContent, HttpResponse, notFound, serverError } from "@shared/helpers"
import { IUserRepository } from "@modules/auth/domain/repositories/i-user-repository"

@injectable()
class DeleteUserUseCase {
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

      await this.userRepository.delete(id)

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { DeleteUserUseCase }
