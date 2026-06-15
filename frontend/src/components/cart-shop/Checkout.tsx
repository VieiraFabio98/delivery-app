import { Bike, CreditCard, Phone, UtensilsCrossed } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { DialogFooter } from "../ui/dialog"
import { CartItem, Endereco } from "./types"


interface CheckoutStepProps {
  endereco: Endereco
  loading: boolean
  itens: CartItem[]
  total: any
  phone: string
  formaPagamento: "pix" | "cartao"
  onBack: () => void
  onConfirm: () => void
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim()
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim()
}

export default function CheckoutStep({ endereco, itens, total, phone, formaPagamento, loading, onBack, onConfirm }: CheckoutStepProps) {
  return (
    <>
      <div className="flex flex-col gap-2 py-2">
        <Card  className="w-full max-w-sm">
          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              Endereço de entrega
              <Bike className="h-4 w-4" />
            </CardTitle>
            <CardDescription>{endereco.rua}, {endereco.numero} - {endereco.bairro} - {endereco.cidade}</CardDescription>

            <CardTitle className="flex items-center gap-2 mt-3 border-t pt-3">
              Contato
              <Phone className="h-4 w-4" />
            </CardTitle>
            <CardDescription>{formatPhone(phone)}</CardDescription>

            <CardTitle className="flex items-center gap-2 mt-3 border-t pt-3">
              Forma de pagamento
              <CreditCard className="h-4 w-4" />
            </CardTitle>
            <CardDescription>{formaPagamento === "pix" ? "Pix" : "Cartão"}</CardDescription>

            <CardTitle className="flex items-center gap-2 mt-3 border-t pt-3">
              Itens do pedido
              <UtensilsCrossed className="h-4 w-4" />
            </CardTitle>
            <div className="flex flex-col gap-1 mt-1">
              {itens.map((i) => (
                <div key={i.produto.id} className="flex justify-between text-sm">
                  <span>{i.quantidade}x {i.produto.nome}</span>
                  <span>R$ {(i.quantidade * Number(i.produto.preco)).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Total</span>
                <span>R$ {Number(total).toFixed(2)}</span>
              </div>
            </div>

          </CardHeader>
        </Card>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button onClick={onConfirm} disabled={loading}>Fazer Pedido</Button>
      </DialogFooter>
    </>
  )
}