import { httpClient } from './axios-http-client.service'
import { IResponse } from '@/shared/interfaces/i-response'

export interface Categoria {
  id: string
  nome: string
}

interface ListCategoriasResponse {
  statusCode: number
  data: Categoria[]
}

interface GetCategoriaResponse {
  statusCode: number
  data: Categoria
}

export const categoriaService = {
  listar: () => httpClient.get<ListCategoriasResponse>('/categorias/list'),
  buscar: (id: string) => httpClient.get<GetCategoriaResponse>(`/categorias/${id}`),
  criar: (nome: string) => httpClient.post<IResponse>('/categorias', { nome }),
  atualizar: (id: string, nome: string) => httpClient.put<IResponse>(`/categorias/${id}`, { nome }),
}
