import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IPedidoRepository } from "@modules/restaurante/domain/repositories/pedido/i-pedido-repository"
import { ICreatePedidoDTO } from "../../dto/i-pedido-dto"




@injectable()
class CreatePedidoUseCase {
  constructor(
    @inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository
  ) {}

  async execute(data: ICreatePedidoDTO): Promise<HttpResponse> {
    try {
      const pedido = await this.pedidoRepository.create({
        clientId: data.clientId,
        itens: data.itens,
        formaPagamento: data.formaPagamento
      })

      return created(pedido)

    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { CreatePedidoUseCase }
