import { ICreateCategoriaDTO, IUpdateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { ICategoria } from "@modules/restaurante/domain/entities/i-categoria"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { Categoria } from "../entities/Categoria"
import { Repository } from "typeorm"
import { appDataSource } from "@database/data-source"


class CategoriaRepository implements ICategoriaRepository {

  private repository: Repository<Categoria>

  constructor() {
    this.repository = appDataSource.getRepository(Categoria)
  }

  async get(id: string): Promise<ICategoria | null> {
    try {
      return this.repository.findOne({ where: { id } })
    } catch(error) {
      throw error
    }
  }

  async list(): Promise<ICategoria[]> {
    try {
      return this.repository.find({ order: { ordem: 'ASC' } })
    } catch(error) {
      throw error
    }
  }

  create(data: ICreateCategoriaDTO): Promise<ICategoria> {
    try {
      const categoria = this.repository.create(data)
      return this.repository.save(categoria)
    } catch(error) {
      throw error
    }
  }

  async update(id: string, data: IUpdateCategoriaDTO): Promise<ICategoria> {
    try {
      await this.repository.update(id, data)

      const updatedCategoria =  await this.repository.findOneBy({ id })

      if (!updatedCategoria) {
        throw new Error('Categoria não encontrado após atualização')
      }
      
      return updatedCategoria
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

export { CategoriaRepository }