import { Produto } from "../entities/Produto"
import { Repository } from "typeorm"
import { appDataSource } from "@database/data-source"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { IProduto } from "@modules/restaurante/domain/entities/i-produto"
import { ICreateProdutoDTO, IUpdateProdutoDTO } from "@modules/restaurante/application/dto/i-produto-dto"



class ProdutoRepository implements IProdutoRepository {

  private repository: Repository<Produto>

  constructor() {
    this.repository = appDataSource.getRepository(Produto)
  }

  async get(id: string): Promise<IProduto | null> {
    try {
      const produto = await this.repository.findOne({ where: { id }})
      return produto 
    } catch(error) {
      throw error
    }
  }

  async list(): Promise<IProduto[]> {
    try {
      const produtos = await this.repository.find({ relations: ['categoria'] })
      console.log(produtos)
      return produtos 
    } catch(error) {
      throw error
    }
  }

  create(data: ICreateProdutoDTO): Promise<IProduto> {
    try {
      const Produto = this.repository.create(data)
      return this.repository.save(Produto)
    } catch(error) {
      throw error
    }
  }

  async update(id: string, data: IUpdateProdutoDTO): Promise<IProduto> {
    try {
      await this.repository.update(id, data)

      const updatedProduto =  await this.repository.findOneBy({ id })

      if (!updatedProduto) {
        throw new Error('Produto não encontrado após atualização')
      }
      
      return updatedProduto
    } catch(error) {
      throw error
    }
  }

  async updateImageUrl(id: string, imageUrl: string): Promise<void> {
    await this.repository.update(id, { imageUrl })
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch(error) {
      throw error
    }
  }

}

export { ProdutoRepository }