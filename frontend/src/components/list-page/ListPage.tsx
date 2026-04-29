import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "../ui/separator"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "../ui/spinner"

export type { ColumnDef }

interface ListPageProps<TData> {
  title: string
  columns: ColumnDef<TData>[]
  data: TData[]
  loading?: boolean
  onCreate?: () => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
}

export default function ListPage<TData>({
  title,
  columns,
  data,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: ListPageProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const columnsWithSelect: ColumnDef<TData>[] = [
    {
      id: "select",
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...columns,
  ]

  const table = useReactTable({
    data,
    columns: columnsWithSelect,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  })

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original)
  const singleSelected = selectedRows.length === 1 ? selectedRows[0] : undefined

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Criar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!singleSelected}
          onClick={() => singleSelected && onEdit?.(singleSelected)}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={selectedRows.length === 0}
          onClick={() => singleSelected && onDelete?.(singleSelected)}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      </div>
      <Separator className="h-0.5" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={header.column.getSize() !== 150 ? { width: header.column.getSize() } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnsWithSelect.length} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full gap-2">
                    <Spinner className="size-7" />Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsWithSelect.length} className="h-24 text-center text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {selectedRows.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} registro(s) selecionado(s).
        </p>
      )}
    </div>
  )
}
