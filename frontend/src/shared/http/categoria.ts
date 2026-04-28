import { httpClient } from '@/services/axios-http-client.service'

export interface Categoria {
  id: string
  nome: string
  createdAt: string
  updatedAt: string
}

export const categoriaService = {
  list: () => httpClient.get<Categoria[]>('/categorias/list'),
  get: (id: string) => httpClient.get<Categoria>(`/categorias/${id}`),
  create: (payload: Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>) => httpClient.post<Categoria>('/categorias', payload),
  update: (id: string, payload: Partial<Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>>) => httpClient.put<Categoria>(`/categorias/${id}`, { id, ...payload }),
  delete: (id: string) => httpClient.delete(`/categorias/${id}`),
}
