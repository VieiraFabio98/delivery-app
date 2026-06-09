import { ICreatePedidoDTO } from "@modules/restaurante/application/dto/i-pedido-dto"
import { IPedido } from "../../entities/i-pedido"

export interface IPedidoWriteRepository {
  create(data: ICreatePedidoDTO): Promise<IPedido>
  update(id: string, data: Partial<IPedido>): Promise<IPedido>
}