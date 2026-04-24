import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { ICreateProdutoDTO } from "../../dto/i-produto-dto"



@injectable()
class CreateProdutoUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(data: ICreateProdutoDTO): Promise<HttpResponse> {
    try {
      const Produto = await this.produtoRepository.create({
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        categoriaId: data.categoriaId
      })

      return created(Produto)

    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { CreateProdutoUseCase }
