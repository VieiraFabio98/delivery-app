import { inject, injectable } from "tsyringe"
import { noContent, HttpResponse, notFound, serverError } from "shared/helpers"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"


@injectable()
class DeleteProdutoUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const Produto = await this.produtoRepository.get(id)

      if (!Produto) {
        return notFound('Produto não encontrada')
      }

      await this.produtoRepository.delete(id)

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { DeleteProdutoUseCase }
