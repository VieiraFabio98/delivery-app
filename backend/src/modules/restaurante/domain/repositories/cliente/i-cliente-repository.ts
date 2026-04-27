import { IClienteReadRepository } from "./i-cliente-read-repository"
import { IClienteWriteRepository } from "./i-cliente-write-repository"

export interface IClienteRepository extends IClienteReadRepository, IClienteWriteRepository {}