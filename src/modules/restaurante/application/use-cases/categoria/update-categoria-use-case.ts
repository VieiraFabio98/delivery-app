import { inject, injectable } from "tsyringe"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { IUpdateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { found, HttpResponse, notFound, serverError } from "shared/helpers"

@injectable()
class UpdateCategoriaUseCase {
  constructor(
    @inject('CategoriaRepository')
    private categoriaRepository: ICategoriaRepository
  ) {}

  async execute(id: string, data: IUpdateCategoriaDTO): Promise<HttpResponse> {
    try {
      const categoria = await this.categoriaRepository.get(id)

      if (!categoria) {
        return notFound('Categoria not found')
      }

      const updated = await this.categoriaRepository.update(id, data)

      return found(updated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { UpdateCategoriaUseCase }
