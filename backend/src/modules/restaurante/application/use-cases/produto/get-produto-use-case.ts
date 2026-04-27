import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"


@injectable()
class GetProdutoUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const Produto = await this.produtoRepository.get(id)

      if (!Produto) {
        return notFound('Produto not found')
      }

      return found(Produto)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { GetProdutoUseCase }
