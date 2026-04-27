import { inject, injectable } from "tsyringe"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/categoria/i-categoria-repository"
import { noContent, HttpResponse, notFound, serverError } from "shared/helpers"

@injectable()
class DeleteCategoriaUseCase {
  constructor(
    @inject('CategoriaRepository')
    private categoriaRepository: ICategoriaRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    try {
      const categoria = await this.categoriaRepository.get(id)

      if (!categoria) {
        return notFound('Categoria não encontrada')
      }

      await this.categoriaRepository.delete(id)

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { DeleteCategoriaUseCase }
