import { ICreateClienteDTO, IUpdateClienteDTO } from "@modules/restaurante/application/dto/i-cliente-controller"
import { ICliente } from "../../entities/i-cliente"


export interface IClienteWriteRepository {
  create(data: ICreateClienteDTO): Promise<ICliente>
  update(id: string, data: IUpdateClienteDTO): Promise<ICliente>
  delete(id: string): Promise<void>
}