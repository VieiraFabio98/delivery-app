import { produtoservice } from "@/services/produtos.service"
import React, { useEffect, useState } from "react"
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

  useEffect(() => {
    produtoservice.list()
      .then((res: any) => setProdutos(res.data))
      .catch(() => toast.error("Erro ao carregar produtos"))
  }, [refresh])

  const toggleAtivo = (id: string) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    )
  }

  function handleImage(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if(!file) {
      toast.error('Erro ao carregar foto, tente novamente.')
      return
    }
    console.log(file)
    
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
            {!produto.ativo && (
              <div className="absolute inset-0 bg-black/60 z-10 rounded-xl" />
            )}
            <div className="relative">
              <img
                src={coxinha}
                alt={produto.nome}
                className="aspect-video w-full object-cover"
              />
              <label
                className="absolute bottom-2 left-2 cursor-pointer rounded-full inline-flex"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(produto.id, e)}
                />
                <Button size="icon" className=" hover:scale-130 transition-transform duration-200 h-7 w-7" asChild>
                  <span><Camera/></span>
                </Button>
              </label>
              <Badge
                className={
                  "absolute bottom-2 right-2 z-20 text-white " +
                  (produto.ativo
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-red-600 hover:bg-red-600")
                }
              >
                {produto.ativo ? "Ativo" : "Inativo"}
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
