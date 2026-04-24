import { IProdutoReadRepository } from "./i-produto-read-repository";
import { IProdutoWriteRepository } from "./i-produto-write-repository";

export interface IProdutoRepository extends IProdutoWriteRepository, IProdutoReadRepository {}