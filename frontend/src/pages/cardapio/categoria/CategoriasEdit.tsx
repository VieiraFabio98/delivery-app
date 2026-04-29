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
import { Label } from "@/components/ui/label"
import { categoriaService } from "@/services/categoria.service"
import { toast } from "sonner"

interface CategoriaDialogProps {
  open: boolean
  onClose: () => void
  categoriaId?: string
}

export default function CategoriaDialog({ open, onClose, categoriaId }: CategoriaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <CategoriaForm
          key={categoriaId ?? "novo"}
          categoriaId={categoriaId}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

interface CategoriaFormProps {
  categoriaId?: string
  onClose: () => void
}

function CategoriaForm({ categoriaId, onClose }: CategoriaFormProps) {
  const isEdicao = !!categoriaId
  const [nome, setNome] = useState("")
  const [carregando, setCarregando] = useState(isEdicao)

  useEffect(() => {
    if (!categoriaId) return

    categoriaService.buscar(categoriaId)
      .then((res) => setNome(res.data.nome))
      .catch((error) => {
        console.error("Erro ao buscar categoria:", error)
        toast.error("Erro ao carregar categoria")
      })
      .finally(() => setCarregando(false))
  }, [categoriaId])

  async function handleSalvar() {
    try {
      const result = isEdicao
        ? await categoriaService.atualizar(categoriaId!, nome)
        : await categoriaService.criar(nome)

      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(isEdicao ? "Categoria atualizada com sucesso!" : "Categoria cadastrada com sucesso!")
        onClose()
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdicao ? "Editar Categoria" : "Cadastrar Categoria"}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          placeholder="Ex: Lanches"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={carregando}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSalvar} disabled={!nome.trim() || carregando}>Salvar</Button>
      </DialogFooter>
    </>
  )
}
