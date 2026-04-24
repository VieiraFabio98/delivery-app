import { ICategoriaReadRepository } from "./i-categoria-read-repository"
import { ICategoriaWriteRepository } from "./i-categoria-write-repository"


export interface ICategoriaRepository extends ICategoriaReadRepository, ICategoriaWriteRepository {}