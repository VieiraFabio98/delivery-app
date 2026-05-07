export interface IProduto {
  id: string
  categoriaId: string
  nome: string
  descricao: string
  preco: number
  isActive: boolean
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}