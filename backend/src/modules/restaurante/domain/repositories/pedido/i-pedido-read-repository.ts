import { IPedido } from "../../entities/i-pedido"

export interface IPedidoReadRepository {
  get(id: string): Promise<IPedido | null>
  getByMpPaymentId(mpPaymentId: string): Promise<IPedido | null>
}
