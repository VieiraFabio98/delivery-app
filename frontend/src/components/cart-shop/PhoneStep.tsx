import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface PhoneStepProps {
  phone: string
  onPhoneChange: (v: string) => void
  loading: boolean
  onBack: () => void
  onConfirm: () => void
}

export default function PhoneStep({ phone, onPhoneChange, loading, onBack, onConfirm }: PhoneStepProps) {
  return (
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
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button onClick={onConfirm} disabled={loading}>Continuar</Button>
      </DialogFooter>
    </>
  )
}
