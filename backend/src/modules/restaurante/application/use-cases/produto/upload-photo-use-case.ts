import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { upload } from "@services/s3.service"
import { HttpResponse, notFound, ok, serverError } from "@shared/helpers"
import { inject, injectable } from "tsyringe"


@injectable()
class UploadPhotoUseCase {
  constructor(
    @inject('ProdutoRepository')
    private produtoRepository: IProdutoRepository
  ) {}

  async execute(id: string, buffer: Buffer): Promise<HttpResponse> {
    try {
      const Produto = await this.produtoRepository.get(id)
      
      if (!Produto) {
        return notFound('Produto not found')
      }

      const image = await upload(buffer, 'teste')
    
      await this.produtoRepository.updateImageUrl(id, image)

      return ok(image)
      
    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { UploadPhotoUseCase }