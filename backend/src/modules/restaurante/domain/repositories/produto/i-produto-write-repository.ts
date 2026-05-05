import { ICreateProdutoDTO, IUpdateProdutoDTO } from "@modules/restaurante/application/dto/i-produto-dto"
import { IProduto } from "../../entities/i-produto"



export interface IProdutoWriteRepository {
  create(data: ICreateProdutoDTO): Promise<IProduto>
  update(id: string, data: IUpdateProdutoDTO): Promise<IProduto>
  updateImageUrl(id: string, imageUrl: string): Promise<void>
  delete(id: string): Promise<void>
}