import { inject, injectable } from "tsyringe"
import { created, HttpResponse, serverError } from "@shared/helpers"
import { IEnderecoRepository } from "@modules/clientes/domain/repositories/endereco/i-endereco-repository"
import { ICreateEnderecoDTO } from "../../dto/i-endereco"


@injectable()
class CreateEnderecoUseCase {
  constructor(
    @inject('EnderecoRepository')
    private enderecoRepository: IEnderecoRepository
  ) {}

  async execute(data: ICreateEnderecoDTO): Promise<HttpResponse> {
    try {
      const endereco = await this.enderecoRepository.create({
        clienteId: data.clienteId,
        cep: data.cep,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        numero: data.numero,
        complemento: data.complemento
      })

      return created(endereco)

    } catch(error) {
      return serverError(error as Error)
    }
  }
}

export { CreateEnderecoUseCase }
