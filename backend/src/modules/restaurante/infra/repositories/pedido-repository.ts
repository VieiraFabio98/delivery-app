
import { Pedido } from "../entities/Pedido"
import { Repository } from "typeorm"
import { appDataSource } from "@database/data-source"
import { IPedidoRepository } from "@modules/restaurante/domain/repositories/pedido/i-pedido-repository"
import { IPedido } from "@modules/restaurante/domain/entities/i-pedido"
import { ICreatePedidoDTO } from "@modules/restaurante/application/dto/i-pedido-dto"


class PedidoRepository implements IPedidoRepository {

  private repository: Repository<Pedido>

  constructor() {
    this.repository = appDataSource.getRepository(Pedido)
  }

  create(data: ICreatePedidoDTO): Promise<IPedido> {
    try {
      const pedido = this.repository.create(data)
      return this.repository.save(pedido)
    } catch(error) {
      throw error
    }
  }

  async get(id: string): Promise<IPedido | null> {
    try {
      return this.repository.findOne({ where: { id } })
    } catch(error) {
      throw error
    }
  }

  async getByMpPaymentId(mpPaymentId: string): Promise<IPedido | null> {
    try {
      return this.repository.findOne({ where: { mpPaymentId } })
    } catch(error) {
      throw error
    }
  }

  async update(id: string, data: Partial<IPedido>): Promise<IPedido> {
    try {
      await this.repository.update(id, data as any)

      const updated = await this.repository.findOneBy({ id })

      if (!updated) {
        throw new Error('Pedido não encontrado após atualização')
      }

      return updated
    } catch(error) {
      throw error
    }
  }

}

export { PedidoRepository }