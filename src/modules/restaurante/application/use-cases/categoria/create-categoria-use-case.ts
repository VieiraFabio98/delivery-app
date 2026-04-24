

import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { ICreateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"


interface Request {
  nome: string
  ordem?: number
}

@injectable()
class CreateCategoriaUseCase {
  constructor(
    @inject('CategoriaRepository')
    private categoriaRepository: ICategoriaRepository
  ) {}

  async execute(data: ICreateCategoriaDTO): Promise<HttpResponse> {
    try {
      const categoria = await this.categoriaRepository.create({
        nome: data.nome,
        ordem: data.ordem
      })

      return created(categoria)

    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { CreateCategoriaUseCase }
