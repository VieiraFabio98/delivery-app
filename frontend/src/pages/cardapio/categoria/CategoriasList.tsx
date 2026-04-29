import { useEffect, useState } from "react"
import ListPage, { type ColumnDef } from "@/components/list-page/ListPage"
import { categoriaService, type Categoria } from "@/services/categorias.service"
import CategoriaEdit from "@/pages/cardapio/categoria/CategoriasEdit"

const columnsTable: ColumnDef<Categoria>[] = [
  { accessorKey: "nome", header: "Nome" },
]

export default function CategoriasList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState<string | undefined>(undefined)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState({})

  useEffect(() => {
    setLoading(true)
    categoriaService.list()
      .then((res) => setCategorias(res.data))
      .finally(() => setLoading(false))
  }, [refresh])

  function create() {
    setIsEdit(undefined)
    setIsDialogOpen(true)
  }

  function edit(categoria: Categoria) {
    setIsEdit(categoria.id)
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setIsEdit(undefined)
  }

  function onSaved() {
    closeDialog()
    setRefresh({})
  }

  return (
    <>
      <ListPage
        title="Categorias"
        columns={columnsTable}
        data={categorias as any[]}
        loading={loading}
        onCreate={create}
        onEdit={edit}
      />
      <CategoriaEdit
        open={isDialogOpen}
        onClose={closeDialog}
        onSaved={onSaved}
        categoriaId={isEdit}
      />
    </>
  )
}
