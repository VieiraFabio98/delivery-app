import { IEndereco } from "../../entities/i-endereco"

export interface IEnderecoReadRepository {
  get(id: string): Promise<IEndereco | null>
  listByCliente(clienteId: string): Promise<IEndereco[]>
}
