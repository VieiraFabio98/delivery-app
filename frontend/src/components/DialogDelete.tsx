import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"

interface DeleteDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteDialog({ open, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ATENÇÃO</DialogTitle>
          <DialogDescription>
            Você está prestes a excluir esse registro.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
