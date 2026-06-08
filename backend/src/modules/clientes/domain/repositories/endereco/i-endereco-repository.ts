import { IEnderecoReadRepository } from "./i-endereco-read-repository"
import { IEnderecoWriteRepository } from "./i-endereco-write-repository"

export interface IEnderecoRepository extends IEnderecoReadRepository, IEnderecoWriteRepository {}
