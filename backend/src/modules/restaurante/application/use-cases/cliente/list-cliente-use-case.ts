import { inject, injectable } from "tsyringe"
import { ok, HttpResponse, serverError } from "shared/helpers"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"

@injectable()
class ListClientesUseCase {
  constructor(
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(): Promise<HttpResponse> {
    try {
      const clientes = await this.clienteRepository.list()

      return ok(clientes)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ListClientesUseCase }
