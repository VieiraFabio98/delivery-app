import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"

@injectable()
class GetEnderecoUseCase {
  constructor(
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const endereco = await this.enderecoRepository.get(id)

      if (!endereco) {
        return notFound('Endereço não encontrado')
      }

      return found(endereco)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { GetEnderecoUseCase }
