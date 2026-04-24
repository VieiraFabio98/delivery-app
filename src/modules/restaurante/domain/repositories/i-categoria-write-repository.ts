import { ICreateCategoriaDTO, IUpdateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { ICategoria } from "../entities/i-categoria"


export interface ICategoriaWriteRepository {
  create(data: ICreateCategoriaDTO): Promise<ICategoria>
  update(id: string, data: IUpdateCategoriaDTO): Promise<ICategoria>
  delete(id: string): Promise<void>
}