import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { pedidoservice } from "@/services/pedido.service"
import { enderecoservice } from "@/services/endereco.service"
import FullScreenLoader from "../FullScreenLoader"
import { toast } from "sonner"
import { CartItem, Endereco, PixData, Step } from "./types"
import CartStep from "./CartStep"
import PhoneStep from "./PhoneStep"
import AddressStep from "./AddressStep"
import PixStep from "./PixStep"
import CheckoutStep from "./Checkout"

interface CartShopProps {
  open: boolean
  onClose: () => void
  itens: CartItem[]
  total: number
  phone: string
  onPhoneChange: (v: string) => void
}

export default function CartShopDialog({ open, onClose, itens, total, phone, onPhoneChange }: CartShopProps) {
  const STORAGE_KEY = "cartShopState"
  const persisted = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") } catch { return {} }
  })()

  const [step, setStep] = useState<Step>(persisted.step ?? "carrinho")
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixData | null>(persisted.pix ?? null)
  const [formaPagamento, setFormaPagamento] = useState<"pix" | "cartao">(persisted.formaPagamento ?? "pix")
  const [endereco, setEndereco] = useState<Endereco>(persisted.endereco ?? { rua: "", bairro: "", cidade: "", numero: "", complemento: "", cep: "" })
  const [cepLoading, setCepLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, pix, formaPagamento, endereco }))
  }, [step, pix, formaPagamento, endereco])

  function resetState() {
    setStep("carrinho")
    setPix(null)
    setEndereco({ rua: "", bairro: "", cidade: "", numero: "", complemento: "", cep: "" })
    localStorage.removeItem(STORAGE_KEY)
  }

  function handleClose() {
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

  async function searchCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
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
    } finally {
      setCepLoading(false)
    }
  }

  function handleConfirmCart() {
    if (!phone) {
      setStep("telefone")
    } else {
      goToAddress(phone)
    }
  }

  function handleConfirmPhone() {
    if (!phone.trim()) {
      toast.error("Informe seu número de WhatsApp")
      return
    }
    goToAddress(phone.trim())
  }

  function handleConfirmAddress() {
    if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.cep.trim()) {
      toast.error("Preencha rua, número e CEP")
      return
    }
    setStep("checkout")
  }

  function handleConfirmCheckout() {
    createOrder(phone.trim())
  }

  const titles: Record<Step, string> = {
    carrinho: "Seu carrinho",
    telefone: "Seu WhatsApp",
    endereco: "Endereço de entrega",
    pix: "Pague com Pix",
    checkout: "Confirme seu pedido",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {loading && <FullScreenLoader />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titles[step]}</DialogTitle>
        </DialogHeader>

        {step === "carrinho" && (
          <CartStep
            itens={itens}
            total={total}
            formaPagamento={formaPagamento}
            onFormaPagamentoChange={setFormaPagamento}
            loading={loading}
            onClose={handleClose}
            onConfirm={handleConfirmCart}
          />
        )}

        {step === "telefone" && (
          <PhoneStep
            phone={phone}
            onPhoneChange={onPhoneChange}
            loading={loading}
            onBack={() => setStep("carrinho")}
            onConfirm={handleConfirmPhone}
          />
        )}

        {step === "endereco" && (
          <AddressStep
            endereco={endereco}
            onEnderecoChange={setEndereco}
            onCepBlur={searchCep}
            cepLoading={cepLoading}
            loading={loading}
            onBack={() => setStep("telefone")}
            onConfirm={handleConfirmAddress}
          />
        )}

        {step === "checkout" && (
          <CheckoutStep
            endereco={endereco}
            itens={itens}
            total={total}
            phone={phone}
            formaPagamento={formaPagamento}
            loading={loading}
            onBack={() => setStep("endereco")}
            onConfirm={handleConfirmCheckout}
          />
        )}

        {step === "pix" && pix && (
          <PixStep pix={pix} onClose={() => { resetState(); onClose() }} />
        )}
      </DialogContent>
    </Dialog>
  )
}
