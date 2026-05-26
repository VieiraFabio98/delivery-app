import { httpClient, axiosInstance } from './axios-http-client.service'
import { IResponse } from '@/shared/interfaces/i-response'


export const pedidoservice = {
  create: (payload: any) => httpClient.post<IResponse>('/pedidos', payload),
}


