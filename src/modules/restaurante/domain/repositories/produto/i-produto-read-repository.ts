import { IProduto } from "../../entities/i-produto"

export interface IProdutoReadRepository {
  get(id: string): Promise<IProduto | null>
  list(): Promise<IProduto[]>
}