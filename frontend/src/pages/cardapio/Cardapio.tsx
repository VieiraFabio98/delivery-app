import { produtoservice } from "@/services/produtos.service"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import coxinha from "@/assets/coxinhha.jpg"
import { Label } from "@/components/ui/label"

export default function Cardapio() {
  const [loading, setLoading] = useState(false)
  const[produtos, setProdutos] = useState<any>([])

  useEffect(() => {
    produtoservice.list()
      .then((res) => setProdutos(res.data))
      .catch((error) => {
         console.error("Erro ao buscar produtos:", error)
          toast.error("Erro ao carregar produtos")
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleNoCardapio = (id: string, value: boolean) => {
    setProdutos((prev: any[]) =>
      prev.map((p) => (p.id === id ? { ...p, noCardapio: value } : p))
    )
  }


  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold">Cardápio</h1>
      <div className="flex flex-wrap gap-4">
        {produtos.map(produto => {
          return(
            <Card className="relative w-full max-w-xs pt-0 overflow-hidden">
              <div className="relative">
                <img
                  src={coxinha}
                  alt={produto.nome}
                  className="aspect-video w-full object-cove"
                />
                <div className="absolute top-2 left-2 z-20">
                  <Switch
                    checked={!!produto.noCardapio}
                    onCheckedChange={(value) => toggleNoCardapio(produto.id, value)}
                  />
                </div>
                <Badge
                  className={
                    "absolute bottom-2 right-2 z-20 text-white " +
                    (produto.noCardapio
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-red-600 hover:bg-red-600")
                  }
                >
                  {produto.noCardapio ? "" : ""}
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
                <Button>Editar</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}