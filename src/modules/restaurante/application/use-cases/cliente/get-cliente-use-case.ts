import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"

@injectable()
class GetClienteUseCase {
  constructor(
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const cliente = await this.clienteRepository.get(id)

      if (!cliente) {
        return notFound('Cliente not found')
      }

      return found(cliente)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { GetClienteUseCase }
