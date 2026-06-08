import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"
import { IUpdateEnderecoDTO } from "../../dto/i-endereco"

@injectable()
class UpdateEnderecoUseCase {
  constructor(
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository
  ) {}

  async execute(id: string, data: IUpdateEnderecoDTO): Promise<HttpResponse> {
    try {
      const endereco = await this.enderecoRepository.get(id)

      if (!endereco) {
        return notFound('Endereço não encontrado')
      }

      const updated = await this.enderecoRepository.update(id, data)

      return found(updated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { UpdateEnderecoUseCase }
