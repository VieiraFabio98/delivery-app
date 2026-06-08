import { inject, injectable } from "tsyringe"
import { ok, HttpResponse, serverError } from "shared/helpers"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"

@injectable()
class ListEnderecosUseCase {
  constructor(
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository
  ) {}

  async execute(clienteId: string): Promise<HttpResponse> {
    try {
      const enderecos = await this.enderecoRepository.listByCliente(clienteId)

      return ok(enderecos)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ListEnderecosUseCase }
