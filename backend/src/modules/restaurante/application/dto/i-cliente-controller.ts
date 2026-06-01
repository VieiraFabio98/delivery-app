export interface ICreateClienteDTO {
  nome?: string
  telefone: string
}

export interface IUpdateClienteDTO {
  id: string
  nome?: string
  telefone?: string
}