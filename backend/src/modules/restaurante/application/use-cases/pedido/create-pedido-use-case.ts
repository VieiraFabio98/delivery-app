import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IPedidoRepository } from "@modules/restaurante/domain/repositories/pedido/i-pedido-repository"
import { ICreatePedidoDTO } from "../../dto/i-pedido-dto"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"
import { criarCobrancaPix } from "@services/mercado-pago.service"


@injectable()
class CreatePedidoUseCase {
  constructor(
    @inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository,
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository,
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository,
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository
  ) {}

  async execute(data: ICreatePedidoDTO): Promise<HttpResponse> {
    try {
      let cliente = await this.clienteRepository.getByPhone(data.telefone!)
      if (!cliente) {
        cliente = await this.clienteRepository.create({
          nome: '',
          telefone: data.telefone!
        })
      }

      let enderecoId: string | undefined
      if (data.endereco) {
        const endereco = await this.enderecoRepository.create({
          clienteId: cliente.id,
          cep: data.endereco.cep,
          rua: data.endereco.rua,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento
        })
        enderecoId = endereco.id
      }

      const itensComPreco = await Promise.all(
        data.itens.map(async (item) => {
          const produto = await this.produtoRepository.get(item.produtoId)
          if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`)
          return { ...item, precoUnitario: Number(produto.preco) }
        })
      )

      const total = itensComPreco.reduce((acc, i) => acc + i.precoUnitario * i.quantidade, 0)

      const pix = await criarCobrancaPix({
        pedidoId: crypto.randomUUID(),
        total,
        telefone: data.telefone!,
      })

      const pedido = await this.pedidoRepository.create({
        clienteId: cliente.id,
        enderecoId,
        itens: itensComPreco,
        formaPagamento: data.formaPagamento,
        total,
        mpPaymentId: pix.mpPaymentId,
      })

      return created({ pedidoId: pedido.id, qrCode: pix.qrCode, qrCodeBase64: pix.qrCodeBase64 })

    } catch(error) {
      console.log(error)
      return serverError(error as Error)
    }
  }
}

export { CreatePedidoUseCase }
