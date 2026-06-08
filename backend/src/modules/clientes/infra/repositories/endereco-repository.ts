import { Endereco } from "../entities/Endereco"
import { Repository } from "typeorm"
import { appDataSource } from "@database/data-source"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"
import { IEndereco } from "@modules/clientes/domain/entities/i-endereco"
import { ICreateEnderecoDTO, IUpdateEnderecoDTO } from "@modules/clientes/application/dto/i-endereco"


class EnderecoRepository implements IEnderecoRepository {

  private repository: Repository<Endereco>

  constructor() {
    this.repository = appDataSource.getRepository(Endereco)
  }

  async get(id: string): Promise<IEndereco | null> {
    try {
      return this.repository.findOne({ where: { id } })
    } catch(error) {
      throw error
    }
  }

  async listByCliente(clienteId: string): Promise<IEndereco[]> {
    try {
      return this.repository.find({ where: { clienteId } })
    } catch(error) {
      throw error
    }
  }

  create(data: ICreateEnderecoDTO): Promise<IEndereco> {
    try {
      const endereco = this.repository.create(data)
      return this.repository.save(endereco)
    } catch(error) {
      throw error
    }
  }

  async update(id: string, data: IUpdateEnderecoDTO): Promise<IEndereco> {
    try {
      await this.repository.update(id, data)

      const updatedEndereco = await this.repository.findOneBy({ id })

      if (!updatedEndereco) {
        throw new Error('Endereço não encontrado após atualização')
      }

      return updatedEndereco
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

export { EnderecoRepository }
