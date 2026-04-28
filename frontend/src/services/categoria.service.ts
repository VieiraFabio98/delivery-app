import { httpClient } from './axios-http-client.service'

export interface Categoria {
  id: string
  nome: string
}

interface ListCategoriasResponse {
  statusCode: number
  data: Categoria[]
}

export const categoriaService = {
  listar: () => httpClient.get<ListCategoriasResponse>('/categorias/list'),
}
