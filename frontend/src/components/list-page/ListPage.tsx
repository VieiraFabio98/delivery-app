import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Separator } from "../ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column<T> {
  label: string
  key: keyof T
  hidden?: boolean
}

interface ListPageProps<T extends Record<string, unknown>> {
  title: string
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onCriar?: () => void
  onEditar?: () => void
  onExcluir?: () => void
}

export default function ListPage<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  loading,
  onCriar,
  onEditar,
  onExcluir,
}: ListPageProps<T>) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={onCriar}>
          <Plus className="w-4 h-4 mr-1" />
          Criar
        </Button>
        <Button variant="outline" size="sm" onClick={onEditar}>
          <Pencil className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={onExcluir}>
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      </div>
      <Separator className="h-0.5" />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.filter((col) => !col.hidden).map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.filter((c) => !c.hidden).length} className="text-center text-muted-foreground">
                Carregando...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.filter((c) => !c.hidden).length} className="text-center text-muted-foreground">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={i}>
                {columns.filter((col) => !col.hidden).map((col) => (
                  <TableCell key={String(col.key)}>{String(row[col.key] ?? '')}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
