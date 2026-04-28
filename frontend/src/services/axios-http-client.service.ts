import axios, { AxiosInstance, AxiosError } from 'axios'

export interface HttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>
  post<T>(url: string, body?: unknown): Promise<T>
  put<T>(url: string, body?: unknown): Promise<T>
  patch<T>(url: string, body?: unknown): Promise<T>
  delete<T>(url: string): Promise<T>
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

export class AxiosHttpClient implements HttpClient {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await axiosInstance.get<T>(url, { params })
    return data
  }
  async post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.post<T>(url, body)
    return data
  }
  async put<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.put<T>(url, body)
    return data
  }
  async patch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.patch<T>(url, body)
    return data
  }
  async delete<T>(url: string): Promise<T> {
    const { data } = await axiosInstance.delete<T>(url)
    return data
  }
}
export const httpClient = new AxiosHttpClient()