import { useEffect, useState } from "react"
import { produtoservice, Produto } from "@/services/produtos.service"
import { categoriaService, Categoria } from "@/services/categorias.service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

interface CartItem {
  produto: Produto
  quantidade: number
}

export default function Menu() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("")

  useEffect(() => {
    Promise.all([categoriaService.list(), produtoservice.list()])
      .then(([cats, prods]: any) => {
        const catsData: Categoria[] = cats.data
        setCategorias(catsData)
        setProdutos(prods.data.filter((p: any) => p.isActive))
        if (catsData.length > 0) setCategoriaAtiva(catsData[0].id)
      })
      .catch(() => toast.error("Erro ao carregar cardápio"))
  }, [])

  function produtosByCategoria(categoriaId: string) {
    return produtos.filter((p: any) => p.categoriaId === categoriaId)
  }

  function incrementar(produto: Produto) {
    setCart((prev) => {
      const atual = prev[produto.id]?.quantidade ?? 0
      return { ...prev, [produto.id]: { produto, quantidade: atual + 1 } }
    })
  }

  function decrementar(produto: Produto) {
    setCart((prev) => {
      const atual = prev[produto.id]?.quantidade ?? 0
      if (atual <= 1) {
        const next = { ...prev }
        delete next[produto.id]
        return next
      }
      return { ...prev, [produto.id]: { produto, quantidade: atual - 1 } }
    })
  }

  const itensCarrinho = Object.values(cart)
  const totalItens = itensCarrinho.reduce((acc, i) => acc + i.quantidade, 0)
  const totalPreco = itensCarrinho.reduce((acc, i) => acc + i.quantidade * i.produto.preco, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Cardápio</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <Badge variant={totalItens === 0 ? "secondary" : "default"}>{totalItens}</Badge>
          <span className="font-semibold text-sm">R$ {totalPreco.toFixed(2)}</span>
        </div>
      </header>

      <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva}>
        <div className="sticky top-[57px] z-40 bg-background border-b">
          <TabsList className="w-full overflow-x-auto rounded-none h-auto border-b border-border px-2 flex justify-center gap-0">
            {categorias.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="shrink-0 px-3 py-2.5 text-sm">
                {cat.nome}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categorias.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-0">
            <div className="w-full max-w-lg mx-auto px-4 py-4 pb-28 flex flex-col gap-3">
              {produtosByCategoria(cat.id).map((produto: any) => {
                const qty = cart[produto.id]?.quantidade ?? 0
                return (
                  <div key={produto.id} className="flex gap-3 items-center rounded-xl border p-3">
                    {produto.imageUrl && (
                      <img
                        src={produto.imageUrl}
                        alt={produto.nome}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base leading-tight">{produto.nome}</p>
                      {produto.descricao && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{produto.descricao}</p>
                      )}
                      <p className="mt-1 text-sm font-semibold">R$ {Number(produto.preco).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {qty > 0 && (
                        <>
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => decrementar(produto)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-5 text-center font-medium text-sm">{qty}</span>
                        </>
                      )}
                      <Button size="icon" className="h-8 w-8" onClick={() => incrementar(produto)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3 safe-area-pb">
        <div className="max-w-lg mx-auto">
          <Button className="w-full" size="lg" disabled={totalItens === 0}>
            {totalItens === 0
              ? "Carrinho vazio"
              : `Ver carrinho · ${totalItens} ${totalItens === 1 ? "item" : "itens"} · R$ ${totalPreco.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
