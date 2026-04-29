import ListPage, { ColumnDef } from "@/components/list-page/ListPage"
import { Produto, produtoservice } from "@/services/produtos.service"
import { useEffect, useState } from "react"
import ProdutosEdit from "./ProdutosEdit"

const columnsTable: ColumnDef<Produto>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorFn: (row) => row.categoria?.nome, header: "Categoria" },
  { accessorKey: "descricao", header: "Descrição" },
  { 
    accessorKey: "preco", 
    header: "Preço",
    cell: ({ row }) => {
      const preco = Number(row.getValue("preco"))
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco)
    }
  },
]

export default function ProdutosList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState<string | undefined>(undefined)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState({})

  useEffect(() => {
      setLoading(true)
      produtoservice.list()
        .then((res) => setProdutos(res.data))
        .finally(() => setLoading(false))
    }, [refresh])

  function create() {
    setIsEdit(undefined)
    setIsDialogOpen(true)
  }

  function edit(produto: Produto) {
    setIsEdit(produto.id)
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
        title="Produtos"
        columns={columnsTable}
        data={produtos as any[]}
        loading={loading}
        onCreate={create}
        onEdit={edit}
      />
      <ProdutosEdit
        open={isDialogOpen}
        onClose={closeDialog}
        onSaved={onSaved}
        produtoId={isEdit}
      />
    </>
  )
}
