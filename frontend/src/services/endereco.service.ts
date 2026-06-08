import { httpClient } from './axios-http-client.service'
import { IResponse } from '@/shared/interfaces/i-response'


export const enderecoservice = {
  listByPhone: (telefone: string) => httpClient.get<IResponse>(`/enderecos/telefone/${telefone}`),
}
