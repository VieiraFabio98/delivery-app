import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Produto } from "@/services/produtos.service"
import { pedidoservice } from "@/services/pedido.service"
import { enderecoservice } from "@/services/endereco.service"
import FullScreenLoader from "../FullScreenLoader"
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

type Step = "carrinho" | "telefone" | "endereco" | "pix"

interface Endereco {
  rua: string
  bairro: string
  cidade: string
  numero: string
  complemento: string
  cep: string
}

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
  const [endereco, setEndereco] = useState<Endereco>({ rua: "", bairro: "", cidade: "", numero: "", complemento: "", cep: "" })

  function handleClose() {
    setStep("carrinho")
    setPix(null)
    onClose()
  }

  async function createOrder(telefone: string) {
    setLoading(true)
    try {
      const res = await pedidoservice.create({
        telefone,
        itens: itens.map(i => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
        formaPagamento,
        endereco: {
          cep: endereco.cep,
          rua: endereco.rua,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          numero: endereco.numero,
          complemento: endereco.complemento,
        },
      })
      setPix(res.data as PixData)
      setStep("pix")
    } catch {
      toast.error("Erro ao criar pedido")
    } finally {
      setLoading(false)
    }
  }

  async function goToAddress(telefone: string) {
    setLoading(true)
    try {
      const res = await enderecoservice.listByPhone(telefone)
      const enderecos = (res.data ?? []) as Endereco[]
      if (enderecos.length > 0) {
        const e = enderecos[0]
        setEndereco({ rua: e.rua, bairro: e.bairro ?? "", cidade: e.cidade ?? "", numero: e.numero, complemento: e.complemento ?? "", cep: e.cep })
      }
    } catch {
      // sem endereço salvo: segue com formulário vazio
    } finally {
      setLoading(false)
      setStep("endereco")
    }
  }

  async function buscarCep(cep: string) {
    const limpo = cep.replace(/\D/g, "")
    if (limpo.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error("CEP não encontrado")
        return
      }
      setEndereco(p => ({
        ...p,
        rua: data.logradouro ?? p.rua,
        bairro: data.bairro ?? p.bairro,
        cidade: data.localidade ?? p.cidade,
      }))
    } catch {
      toast.error("Erro ao buscar CEP")
    }
  }

  function handleConfirmarCarrinho() {
    if (!phone) {
      setStep("telefone")
    } else {
      goToAddress(phone)
    }
  }

  function handleConfirmarTelefone() {
    if (!phone.trim()) {
      toast.error("Informe seu número de WhatsApp")
      return
    }
    goToAddress(phone.trim())
  }

  function handleConfirmarEndereco() {
    if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.cep.trim()) {
      toast.error("Preencha rua, número e CEP")
      return
    }
    createOrder(phone.trim())
  }

  const titles: Record<Step, string> = {
    carrinho: "Seu carrinho",
    telefone: "Seu WhatsApp",
    endereco: "Endereço de entrega",
    pix: "Pague com Pix",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {loading && <FullScreenLoader />}
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

        {step === "endereco" && (
          <>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" value={endereco.cep} onChange={e => setEndereco(p => ({ ...p, cep: e.target.value.replace(/\D/g, "") }))} onBlur={e => buscarCep(e.target.value)} maxLength={8} />
                </div>
                <div className="flex flex-col gap-1.5 w-24">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" placeholder="123" value={endereco.numero} onChange={e => setEndereco(p => ({ ...p, numero: e.target.value }))} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rua">Rua</Label>
                <Input id="rua" placeholder="Nome da rua" value={endereco.rua} onChange={e => setEndereco(p => ({ ...p, rua: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" placeholder="Bairro" value={endereco.bairro} onChange={e => setEndereco(p => ({ ...p, bairro: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" placeholder="Cidade" value={endereco.cidade} onChange={e => setEndereco(p => ({ ...p, cidade: e.target.value }))} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" placeholder="Apto, bloco... (opcional)" value={endereco.complemento} onChange={e => setEndereco(p => ({ ...p, complemento: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("telefone")}>Voltar</Button>
              <Button onClick={handleConfirmarEndereco} disabled={loading}>Continuar</Button>
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
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(pix.qrCode).then(() => toast.success("Código copiado!"))
                      } else {
                        const el = document.createElement("textarea")
                        el.value = pix.qrCode
                        document.body.appendChild(el)
                        el.select()
                        document.execCommand("copy")
                        document.body.removeChild(el)
                        toast.success("Código copiado!")
                      }
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
