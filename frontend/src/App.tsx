import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pedidos from "./pages/pedidos/Pedidos";
import Conversas from "./pages/conversas/Conversas";
import Produtos from "./pages/cardapio/Produtos";
import Categorias from "./pages/cardapio/categoria/CategoriasList";
import Clientes from "./pages/clientes/Clientes";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="conversas" element={<Conversas />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="clientes" element={<Clientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}