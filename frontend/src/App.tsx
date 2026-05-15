import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pedidos from "./pages/pedidos/Pedidos";
import Conversas from "./pages/conversas/Conversas";
import ProdutosList from "./pages/cardapio/produtos/ProdutosList";
import Clientes from "./pages/clientes/Clientes";
import CategoriasList from "./pages/cardapio/categoria/CategoriasList";
import Cardapio from "./pages/cardapio/Cardapio";
import Menu from "./pages/menu/Menu";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="cardapio" element={<Cardapio />} />
          <Route path="conversas" element={<Conversas />} />
          <Route path="produtos" element={<ProdutosList />} />
          <Route path="categorias" element={<CategoriasList />} />
          <Route path="clientes" element={<Clientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}