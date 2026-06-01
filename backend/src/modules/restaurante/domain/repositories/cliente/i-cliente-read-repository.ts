import { ICliente } from "../../entities/i-cliente"



export interface IClienteReadRepository {
  get(id: string): Promise<ICliente | null>
  getByPhone(phone: string): Promise<ICliente | null>
  list(): Promise<ICliente[]>
}