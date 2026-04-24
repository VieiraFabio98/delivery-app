
import { Cliente } from "../entities/Cliente"
import { Repository } from "typeorm"
import { appDataSource } from "@database/data-source"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { ICliente } from "@modules/restaurante/domain/entities/i-cliente"
import { ICreateClienteDTO, IUpdateClienteDTO } from "@modules/restaurante/application/dto/i-cliente-controller"


class ClienteRepository implements IClienteRepository {

  private repository: Repository<Cliente>

  constructor() {
    this.repository = appDataSource.getRepository(Cliente)
  }

  async get(id: string): Promise<ICliente | null> {
    try {
      return this.repository.findOne({ where: { id } })
    } catch(error) {
      throw error
    }
  }

  async list(): Promise<ICliente[]> {
    try {
      return this.repository.find()
    } catch(error) {
      throw error
    }
  }

  create(data: ICreateClienteDTO): Promise<ICliente> {
    try {
      const Cliente = this.repository.create(data)
      return this.repository.save(Cliente)
    } catch(error) {
      throw error
    }
  }

  async update(id: string, data: IUpdateClienteDTO): Promise<ICliente> {
    try {
      await this.repository.update(id, data)

      const updatedCliente =  await this.repository.findOneBy({ id })

      if (!updatedCliente) {
        throw new Error('Cliente não encontrado após atualização')
      }
      
      return updatedCliente
    } catch(error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch(error) {
      throw error
    }
  }

}

export { ClienteRepository }