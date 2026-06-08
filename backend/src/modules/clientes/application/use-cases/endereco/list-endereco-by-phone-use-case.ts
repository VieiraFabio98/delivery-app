import { inject, injectable } from "tsyringe"
import { ok, HttpResponse, serverError } from "shared/helpers"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"

@injectable()
class ListEnderecosByPhoneUseCase {
  constructor(
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository,
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(telefone: string): Promise<HttpResponse> {
    try {
      const cliente = await this.clienteRepository.getByPhone(telefone)

      if (!cliente) {
        return ok([])
      }

      const enderecos = await this.enderecoRepository.listByCliente(cliente.id)

      return ok(enderecos)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ListEnderecosByPhoneUseCase }
