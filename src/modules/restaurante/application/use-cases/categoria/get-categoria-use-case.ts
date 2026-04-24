import { inject, injectable } from "tsyringe"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"

@injectable()
class GetCategoriaUseCase {
  constructor(
    @inject('CategoriaRepository')
    private categoriaRepository: ICategoriaRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const categoria = await this.categoriaRepository.get(id)

      if (!categoria) {
        return notFound('Categoria not found')
      }

      return found(categoria)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { GetCategoriaUseCase }
