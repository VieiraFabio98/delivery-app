import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { CartItem } from "./types"

interface CartStepProps {
  itens: CartItem[]
  total: number
  formaPagamento: "pix" | "cartao"
  onFormaPagamentoChange: (v: "pix" | "cartao") => void
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function CartStep({ itens, total, formaPagamento, onFormaPagamentoChange, loading, onClose, onConfirm }: CartStepProps) {
  return (
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
                onClick={() => onFormaPagamentoChange(op)}
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
        <Button variant="outline" onClick={onClose}>Continuar comprando</Button>
        <Button onClick={onConfirm} disabled={loading}>Avançar</Button>
      </DialogFooter>
    </>
  )
}
