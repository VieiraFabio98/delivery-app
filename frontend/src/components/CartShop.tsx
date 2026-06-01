import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Produto } from "@/services/produtos.service"
import { pedidoservice } from "@/services/pedido.service"
import { toast } from "sonner"

interface CartItem {
  produto: Produto
  quantidade: number
}

interface CartShopProps {
  open: boolean
  onClose: () => void
  itens: CartItem[]
  total: number
  phone: string
  onPhoneChange: (v: string) => void
}

type Step = "carrinho" | "telefone" | "pix"

interface PixData {
  pedidoId: string
  qrCode: string
  qrCodeBase64: string
}

export default function CartShopDialog({ open, onClose, itens, total, phone, onPhoneChange }: CartShopProps) {
  const [step, setStep] = useState<Step>("carrinho")
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixData | null>(null)
  const [formaPagamento, setFormaPagamento] = useState<"pix" | "cartao">("pix")

  function handleClose() {
    setStep("carrinho")
    setPix(null)
    onClose()
  }

  async function criarPedido(telefone: string) {
    setLoading(true)
    try {
      const res = await pedidoservice.create({
        telefone,
        itens: itens.map(i => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
        formaPagamento,
      })
      setPix(res.data as PixData)
      setStep("pix")
    } catch {
      toast.error("Erro ao criar pedido")
    } finally {
      setLoading(false)
    }
  }

  function handleConfirmarCarrinho() {
    if (!phone) {
      setStep("telefone")
    } else {
      criarPedido(phone)
    }
  }

  function handleConfirmarTelefone() {
    if (!phone.trim()) {
      toast.error("Informe seu número de WhatsApp")
      return
    }
    criarPedido(phone.trim())
  }

  const titles: Record<Step, string> = {
    carrinho: "Seu carrinho",
    telefone: "Seu WhatsApp",
    pix: "Pague com Pix",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titles[step]}</DialogTitle>
        </DialogHeader>

        {step === "carrinho" && (
          <>
            <div className="flex flex-col gap-2 py-2">
              {itens.map(({ produto, quantidade }) => (
                <div key={produto.id} className="flex justify-between text-sm">
                  <span>{quantidade}x {produto.nome}</span>
                  <span>R$ {(quantidade * produto.preco).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex flex-col gap-2">
                <Label>Forma de pagamento</Label>
                <div className="flex gap-2">
                  {(["pix", "cartao"] as const).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setFormaPagamento(op)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        formaPagamento === op
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-accent"
                      }`}
                    >
                      {op === "pix" ? "Pix" : "Cartão de crédito"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Continuar comprando</Button>
              <Button onClick={handleConfirmarCarrinho} disabled={loading}>Confirmar pedido</Button>
            </DialogFooter>
          </>
        )}

        {step === "telefone" && (
          <>
            <div className="flex flex-col gap-3 py-2">
              <p className="text-sm text-muted-foreground">Precisamos do seu número para enviar a confirmação pelo WhatsApp.</p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">WhatsApp (com DDD)</Label>
                <Input
                  id="phone"
                  placeholder="11999999999"
                  value={phone}
                  onChange={e => onPhoneChange(e.target.value.replace(/\D/g, ""))}
                  maxLength={13}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("carrinho")}>Voltar</Button>
              <Button onClick={handleConfirmarTelefone} disabled={loading}>Continuar</Button>
            </DialogFooter>
          </>
        )}

        {step === "pix" && pix && (
          <>
            <div className="flex flex-col items-center gap-4 py-2">
              <img
                src={`data:image/png;base64,${pix.qrCodeBase64}`}
                alt="QR Code Pix"
                className="h-48 w-48"
              />
              <div className="w-full">
                <Label>Pix copia e cola</Label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={pix.qrCode} className="text-xs" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(pix.qrCode)
                      toast.success("Código copiado!")
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">Após o pagamento você receberá a confirmação pelo WhatsApp.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Fechar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
