import { Produto } from "@/services/produtos.service"

export interface CartItem {
  produto: Produto
  quantidade: number
}

export type Step = "carrinho" | "telefone" | "endereco" | "pix"

export interface Endereco {
  rua: string
  bairro: string
  cidade: string
  numero: string
  complemento: string
  cep: string
}

export interface PixData {
  pedidoId: string
  qrCode: string
  qrCodeBase64: string
}
