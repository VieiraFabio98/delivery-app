import { IPedidoReadRepository } from "./i-pedido-read-repository"
import { IPedidoWriteRepository } from "./i-pedido-write-repository"

export interface IPedidoRepository extends IPedidoReadRepository, IPedidoWriteRepository {}