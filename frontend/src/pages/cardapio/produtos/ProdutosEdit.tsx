import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categoriaService, type Categoria } from "@/services/categorias.service"
import { produtoservice } from "@/services/produtos.service"
import { toast } from "sonner"

interface ProdutosDialogProps {
  open: boolean
  onClose: () => void
  onSaved?: () => void
  produtoId?: string
}

export default function ProdutosEdit({ open, onClose, onSaved, produtoId }: ProdutosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-2xl">
        <ProdutoForm
          key={produtoId ?? "novo"}
          produtoId={produtoId}
          onClose={onClose}
          onSaved={onSaved}
        />
      </DialogContent>
    </Dialog>
  )
}

interface ProdutoFormProps {
  produtoId?: string
  onClose: () => void
  onSaved?: () => void
}

function ProdutoForm({ produtoId, onClose, onSaved }: ProdutoFormProps) {
  const isEdicao = !!produtoId
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(isEdicao)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!produtoId) {
      categoriaService.list()
        .then((res: any) => setCategorias(res.data))
        .finally(() => setIsLoading(false))
      return
    }

    Promise.all([
      categoriaService.list(),
      produtoservice.get(produtoId),
    ]).then(([cats, prod]: any) => {
        const p = prod.data
        setCategorias(cats.data)
        setCategoriaId(p.categoriaId)
        setNome(p.nome)
        setDescricao(p.descricao)
        setPreco(String(p.preco))
      })
      .catch(() => toast.error("Erro ao carregar produto"))
      .finally(() => setIsLoading(false))
  }, [produtoId])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !produtoId) return
    setIsUploading(true)
    try {
      await produtoservice.uploadImage(produtoId, file)
      toast.success("Foto atualizada com sucesso!")
    } catch {
      toast.error("Erro ao fazer upload da foto")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSave() {
    const payload = { nome, descricao, preco: Number(preco), categoriaId }
    try {
      const result = isEdicao
        ? await produtoservice.update(produtoId!, payload)
        : await produtoservice.create(payload)

      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(isEdicao ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!")
        onSaved ? onSaved() : onClose()
      }
    } catch (error) {
      toast.error("Erro ao salvar produto")
    }
  }

  const canSave = !!nome.trim() && !!categoriaId && !isLoading

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdicao ? "Editar Produto" : "Cadastrar Produto"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <Input
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Categoria</FieldLabel>
          {categorias.length > 0 && (
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        <Field>
          <FieldLabel>Descrição</FieldLabel>
          <Input
            placeholder="Descrição do produto"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Preço</FieldLabel>
          <Input
            type="number"
            placeholder="0,00"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </Field>
        {isEdicao && (
          <Field className="col-span-2">
            <FieldLabel>Foto do produto</FieldLabel>
            <Input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleImageChange}
            />
          </Field>
        )}
        <DialogFooter className="col-span-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={!canSave}>Salvar</Button>
        </DialogFooter>
      </form>
    </>
  )
}
