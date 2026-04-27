import { ICategoria } from "../../entities/i-categoria";


export interface ICategoriaReadRepository {
  get(id: string): Promise<ICategoria | null>
  list(): Promise<ICategoria[]>
}