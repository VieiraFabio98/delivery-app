import { useEffect, useState } from "react"
import ListPage from "@/components/list-page/ListPage"
import CategoriaDialog from "@/components/list-page/CategoriaDialog"
import { categoriaService, type Categoria } from "@/services/categoria.service"

const COLUMNS = [
  { label: "id", key: "id" as const, hidden: true },
  { label: "Nome", key: "nome" as const },
]

export default function Categorias() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriaService.listar()
      .then((res) => setCategorias(res.data))
      .finally(() => setLoading(false))
  }, [])

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
        onClose={() => setDialogAberto(false)}
      />
    </>
  )
}
