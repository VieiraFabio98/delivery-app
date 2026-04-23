

export interface ICreateCategoriaDTO {
  nome: string
  ordem: number
  createdAt: Date
  updatedAt: Date
}

export interface IUpdateCategoriaDTO {
  id: string
  nome?: string
  ordem?: number
  createdAt?: Date
  updatedAt?: Date
}
