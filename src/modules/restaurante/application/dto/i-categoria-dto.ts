

export interface ICreateCategoriaDTO {
  nome: string
  ordem: number
}

export interface IUpdateCategoriaDTO {
  id: string
  nome?: string
  ordem?: number
}
