import { DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Endereco } from "./types"

interface AddressStepProps {
  endereco: Endereco
  onEnderecoChange: (updater: (prev: Endereco) => Endereco) => void
  onCepBlur: (cep: string) => void
  cepLoading: boolean
  loading: boolean
  onBack: () => void
  onConfirm: () => void
}

function formatCep(cep: string) {
  const d = cep.replace(/\D/g, "").slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export default function AddressStep({ endereco, onEnderecoChange, onCepBlur, cepLoading, loading, onBack, onConfirm }: AddressStepProps) {
  function CepSpinner() {
    return <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
  }

  return (
    <>
      <div className="flex flex-col gap-3 py-2">
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" placeholder="00000-000" value={formatCep(endereco.cep)} onChange={e => onEnderecoChange(p => ({ ...p, cep: e.target.value.replace(/\D/g, "").slice(0, 8) }))} onBlur={() => onCepBlur(endereco.cep)} maxLength={9} />
          </div>
          <div className="flex flex-col gap-1.5 w-24">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" placeholder="123" value={endereco.numero} onChange={e => onEnderecoChange(p => ({ ...p, numero: e.target.value }))} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rua">Rua</Label>
          <div className="relative">
            <Input id="rua" placeholder="Nome da rua" value={endereco.rua} disabled={cepLoading} onChange={e => onEnderecoChange(p => ({ ...p, rua: e.target.value }))} />
            {cepLoading && <CepSpinner />}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="bairro">Bairro</Label>
            <div className="relative">
              <Input id="bairro" placeholder="Bairro" value={endereco.bairro} disabled={cepLoading} onChange={e => onEnderecoChange(p => ({ ...p, bairro: e.target.value }))} />
              {cepLoading && <CepSpinner />}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="cidade">Cidade</Label>
            <div className="relative">
              <Input id="cidade" placeholder="Cidade" value={endereco.cidade} disabled={cepLoading} onChange={e => onEnderecoChange(p => ({ ...p, cidade: e.target.value }))} />
              {cepLoading && <CepSpinner />}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="complemento">Complemento</Label>
          <Input id="complemento" placeholder="Apto, bloco... (opcional)" value={endereco.complemento} onChange={e => onEnderecoChange(p => ({ ...p, complemento: e.target.value }))} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button onClick={onConfirm} disabled={loading}>Continuar</Button>
      </DialogFooter>
    </>
  )
}
