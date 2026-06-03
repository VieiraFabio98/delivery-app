import { MercadoPagoConfig, Payment } from 'mercadopago'

interface CriarPixParams {
  pedidoId: string
  total: number
  telefone: string
}

interface PixResult {
  mpPaymentId: string
  qrCode: string
  qrCodeBase64: string
}

export async function criarCobrancaPix({ pedidoId, total, telefone }: CriarPixParams): Promise<PixResult> {
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
  const payment = new Payment(client)

  console.log(process.env.MP_ACCESS_TOKEN)

  const resultado = await payment.create({
    body: {
      transaction_amount: total,
      description: `Pedido ${pedidoId}`,
      payment_method_id: 'pix',
      payer: {
        email: `${telefone}@tozetto.com`,
      },
      external_reference: pedidoId,
    },
    requestOptions: {
      idempotencyKey: pedidoId,
    },
  })

  const txData = resultado.point_of_interaction?.transaction_data

  if (!txData?.qr_code || !txData?.qr_code_base64) {
    throw new Error('MP não retornou QR Code')
  }

  return {
    mpPaymentId: String(resultado.id),
    qrCode: txData.qr_code,
    qrCodeBase64: txData.qr_code_base64,
  }
}
