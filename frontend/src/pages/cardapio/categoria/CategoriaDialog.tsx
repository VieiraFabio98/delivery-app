import { useState } from "react"
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
// import { categoriaService } from "@/shared/http/categoria"
import { AxiosHttpClient } from "@/services/axios-http-client.service"
import { IResponse } from "@/shared/interfaces/i-response"
import { toast } from "sonner"

interface CategoriaDialogProps {
  open: boolean
  onClose: () => void
}

export default function CategoriaDialog({ open, onClose }: CategoriaDialogProps) {
  const axios = new AxiosHttpClient()
  const [nome, setNome] = useState("")

  async function handleSalvar() {
    try {
      const result: IResponse =  await axios.post("/categorias", { nome })
      if(result.statusCode === 201) {
        toast.success("Categoria cadastrada com sucesso!")
      }
      setNome("")
    } catch(error) {
      console.error("Erro ao salvar categoria:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Categoria</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            placeholder="Ex: Lanches"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSalvar} disabled={!nome.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
