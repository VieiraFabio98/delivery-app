export interface ICreateProdutoDTO {
  categoriaId: string
  nome: string
  descricao: string
  preco: number
}

export interface IUpdateProdutoDTO {
  id: string
  categoriaId: string
  nome: string
  descricao: string
  preco: number
}