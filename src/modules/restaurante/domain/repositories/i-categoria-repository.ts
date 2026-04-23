import { ICreateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { ICategoria } from "../entities/i-categoria"


export interface ICategoriaRepository {
  create(data: ICreateCategoriaDTO): Promise<ICategoria>
}