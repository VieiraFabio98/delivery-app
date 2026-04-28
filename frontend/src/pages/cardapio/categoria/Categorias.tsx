import { useEffect, useState } from "react"
import ListPage, { type ColumnDef } from "@/components/list-page/ListPage"
import CategoriaDialog from "@/pages/cardapio/categoria/CategoriaDialog"
import { categoriaService, type Categoria } from "@/services/categoria.service"

const COLUMNS: ColumnDef<Categoria>[] = [
  { accessorKey: "nome", header: "Nome" },
]

export default function Categorias() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState({})

  useEffect(() => {
    setLoading(true)
    categoriaService.listar()
      .then((res) => setCategorias(res.data))
      .finally(() => setLoading(false))
  }, [refresh])

  return (
    <>
      <ListPage
        title="Categorias"
        columns={COLUMNS}
        data={categorias as any[]}
        loading={loading}
        onCriar={() => setDialogAberto(true)}
      />
      <CategoriaDialog
        open={dialogAberto}
        onClose={() => { 
          setDialogAberto(false) 
          setRefresh({}) 
        }}
      />
    </>
  )
}
