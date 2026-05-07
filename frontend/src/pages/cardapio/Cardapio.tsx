import { produtoservice } from "@/services/produtos.service"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import coxinha from "@/assets/coxinhha.jpg"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProdutosEdit from "./produtos/ProdutosEdit"
import { Camera } from "lucide-react"

export default function Cardapio() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [refresh, setRefresh] = useState({})
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    produtoservice.list()
      .then((res: any) => setProdutos(res.data))
      .catch(() => toast.error("Erro ao carregar produtos"))
  }, [refresh])

  const toggleAtivo = (id: string) => {
    let nextValue = false
    setProdutos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        nextValue = !p.isActive
        return { ...p, isActive: nextValue }
      })
    )

    clearTimeout(debounceTimers.current[id])
    debounceTimers.current[id] = setTimeout(async () => {
      try {
        await produtoservice.update(id, { isActive: nextValue })
      } catch {
        toast.error("Erro ao atualizar status do produto")
        setRefresh({})
      }
    }, 2000)
  }

  async function handleImage(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await produtoservice.uploadImage(id, file)
      toast.success("Foto atualizada com sucesso!")
      setRefresh({})
    } catch {
      toast.error("Erro ao fazer upload da foto")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold">Cardápio</h1>
      <div className="flex flex-wrap gap-4">
        {produtos.map((produto) => (
          <Card
            key={produto.id}
            className="relative w-full max-w-xs pt-0 overflow-hidden cursor-pointer select-none hover:scale-105 transition-transform duration-200"
            onClick={() => toggleAtivo(produto.id)}
          >
            {!produto.isActive && (
              <div className="absolute inset-0 bg-black/60 z-10 rounded-xl" />
            )}
            <div className="relative">
              <img
                src={produto.imageUrl}
                alt={produto.nome}
                className="aspect-video w-full object-cover"
              />
              <input
                id={`foto-${produto.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleImage(produto.id, e)}
              />
              <Button
                size="icon"
                className="absolute bottom-2 left-2 hover:scale-130 transition-transform duration-200 h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById(`foto-${produto.id}`)?.click()
                }}
              >
                <Camera />
              </Button>
              <Badge
                className={
                  "absolute bottom-2 right-2 z-20 text-white " +
                  (produto.isActive
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-red-600 hover:bg-red-600")
                }
              >
                {produto.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">R$ {produto.preco}</Badge>
              </CardAction>
              <CardTitle>{produto.nome}</CardTitle>
              <CardDescription>{produto.descricao}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={(e) => { e.stopPropagation(); setEditId(produto.id) }}>Editar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ProdutosEdit
        open={!!editId}
        produtoId={editId}
        onClose={() => setEditId(undefined)}
        onSaved={() => { 
          setEditId(undefined) 
          setRefresh({}) 
        }}
      />
    </div>
  )
}
