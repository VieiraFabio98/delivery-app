import { httpClient, axiosInstance } from './axios-http-client.service'
import { IResponse } from '@/shared/interfaces/i-response'
import { Categoria } from './categorias.service'

export interface Produto {
  id: string
  categoriaId: string
  categoria: Categoria
  nome: string
  descricao: string
  preco: number
  imageUrl?: string
}

export const produtoservice = {
  list: () => httpClient.get<IResponse>('/produtos/list'),
  get: (id: string) => httpClient.get<IResponse>(`/produtos/${id}`),
  create: (payload: any) => httpClient.post<IResponse>('/produtos', payload),
  update: (id: string, payload: any) => httpClient.put<IResponse>(`/produtos/${id}`, payload),
  delete: (id: string) => httpClient.delete<void>(`/produtos/${id}`),
  uploadImage: async (id: string, file: File): Promise<IResponse> => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await axiosInstance.post<IResponse>(`/produtos/image/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}


