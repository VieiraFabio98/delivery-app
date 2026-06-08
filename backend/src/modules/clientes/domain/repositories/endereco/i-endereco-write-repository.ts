import { ICreateEnderecoDTO, IUpdateEnderecoDTO } from "@modules/clientes/application/dto/i-endereco-controller"
import { IEndereco } from "../../entities/i-endereco"

export interface IEnderecoWriteRepository {
  create(data: ICreateEnderecoDTO): Promise<IEndereco>
  update(id: string, data: IUpdateEnderecoDTO): Promise<IEndereco>
  delete(id: string): Promise<void>
}
