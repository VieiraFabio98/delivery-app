export interface IProduto {
  id: string
  categoriaId: string
  nome: string
  descricao: string
  preco: number
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}