import { inject, injectable } from "tsyringe"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { IUpdateProdutoDTO } from "../../dto/i-produto-dto"


@injectable()
class UpdateProdutoUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(id: string, data: IUpdateProdutoDTO): Promise<HttpResponse> {
    try {
      const Produto = await this.produtoRepository.get(id)

      if (!Produto) {
        return notFound('Produto not found')
      }

      const updated = await this.produtoRepository.update(id, data)

      return found(updated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { UpdateProdutoUseCase }
