import { inject, injectable } from "tsyringe"
import { noContent, HttpResponse, notFound, serverError } from "shared/helpers"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"

@injectable()
class DeleteClienteUseCase {
  constructor(
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const cliente = await this.clienteRepository.get(id)

      if (!cliente) {
        return notFound('Cliente não encontrada')
      }

      await this.clienteRepository.delete(id)

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { DeleteClienteUseCase }
