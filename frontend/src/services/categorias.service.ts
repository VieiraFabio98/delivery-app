import { httpClient } from './axios-http-client.service'
import { IResponse } from '@/shared/interfaces/i-response'

export interface Categoria {
  id: string
  nome: string
}

export const categoriaService = {
  list: () => httpClient.get<IResponse>('/categorias/list'),
  get: (id: string) => httpClient.get<IResponse>(`/categorias/${id}`),
  create: (payload: any) => httpClient.post<IResponse>('/categorias', payload),
  update: (id: string, payload: any) => httpClient.put<IResponse>(`/categorias/${id}`, payload),
}
