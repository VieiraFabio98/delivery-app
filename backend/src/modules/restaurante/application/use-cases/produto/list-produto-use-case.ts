import { inject, injectable } from "tsyringe"
import { ok, HttpResponse, serverError } from "shared/helpers"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"


@injectable()
class ListProdutosUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(): Promise<HttpResponse> {
    try {
      const Produtos = await this.produtoRepository.list()

      return ok(Produtos)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ListProdutosUseCase }
