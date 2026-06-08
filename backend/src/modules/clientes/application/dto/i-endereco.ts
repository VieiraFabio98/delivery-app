export interface ICreateEnderecoDTO {
  clienteId: string
  cep: string
  rua: string
  bairro?: string
  cidade?: string
  numero: string
  complemento?: string
}

export interface IUpdateEnderecoDTO {
  id: string
  cep?: string
  rua?: string
  bairro?: string
  cidade?: string
  numero?: string
  complemento?: string
}
