import { useState } from "react"
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

interface CartShopProps {
  open: boolean
  onClose: () => void
  itens: CartItem[]
  total: number
  phone: string
  onPhoneChange: (v: string) => void
}

export default function CartShopDialog({ open, onClose, itens, total, phone, onPhoneChange }: CartShopProps) {
  const [step, setStep] = useState<Step>("carrinho")
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixData | null>(null)
  const [formaPagamento, setFormaPagamento] = useState<"pix" | "cartao">("pix")
  const [endereco, setEndereco] = useState<Endereco>({ rua: "", bairro: "", cidade: "", numero: "", complemento: "", cep: "" })
  const [cepLoading, setCepLoading] = useState(false)

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
    setCepLoading(true)
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
    } finally {
      setCepLoading(false)
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
          <CartStep
            itens={itens}
            total={total}
            formaPagamento={formaPagamento}
            onFormaPagamentoChange={setFormaPagamento}
            loading={loading}
            onClose={handleClose}
            onConfirm={handleConfirmarCarrinho}
          />
        )}

        {step === "telefone" && (
          <PhoneStep
            phone={phone}
            onPhoneChange={onPhoneChange}
            loading={loading}
            onBack={() => setStep("carrinho")}
            onConfirm={handleConfirmarTelefone}
          />
        )}

        {step === "endereco" && (
          <AddressStep
            endereco={endereco}
            onEnderecoChange={setEndereco}
            onCepBlur={buscarCep}
            cepLoading={cepLoading}
            loading={loading}
            onBack={() => setStep("telefone")}
            onConfirm={handleConfirmarEndereco}
          />
        )}

        {step === "pix" && pix && (
          <PixStep pix={pix} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
