import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { ICreateClienteDTO } from "../../dto/i-cliente-controller"


@injectable()
class CreateClienteUseCase {
  constructor(
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository
  ) {}

  async execute(data: ICreateClienteDTO): Promise<HttpResponse> {
    try {
      const cliente = await this.clienteRepository.create({
        nome: data.nome,
        telefone: data.telefone
      })

      return created(cliente)

    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { CreateClienteUseCase }
