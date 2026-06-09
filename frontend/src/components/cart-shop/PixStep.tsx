import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PixData } from "./types"
import { toast } from "sonner"

interface PixStepProps {
  pix: PixData
  onClose: () => void
}

export default function PixStep({ pix, onClose }: PixStepProps) {
  function copy() {
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
  }

  return (
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
            <Button variant="outline" onClick={copy}>Copiar</Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">Após o pagamento você receberá a confirmação pelo WhatsApp.</p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Fechar</Button>
      </DialogFooter>
    </>
  )
}
