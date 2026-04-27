import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { IUpdateClienteDTO } from "../../dto/i-cliente-controller"

@injectable()
class UpdateClienteUseCase {
  constructor(
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(id: string, data: IUpdateClienteDTO): Promise<HttpResponse> {
    try {
      const cliente = await this.clienteRepository.get(id)

      if (!cliente) {
        return notFound('Cliente not found')
      }

      const updated = await this.clienteRepository.update(id, data)

      return found(updated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { UpdateClienteUseCase }
