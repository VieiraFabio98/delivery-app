import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (!res.ok) {
        setErro('E-mail ou senha inválidos.')
        return
      }

      const { token } = await res.json()
      localStorage.setItem('token', token)
      navigate('/pedidos')
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* lado esquerdo — 60% preto */}
      <div className="hidden lg:flex lg:w-3/5 bg-black items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-white">Tozetto Delivery</h1>
          <p className="text-zinc-400 text-lg">Gestão de pedidos via Web/WhatsApp</p>
        </div>
      </div>

      {/* lado direito — 40% painel de login */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-8 bg-background rounded-lg p-4 shadow">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Entrar</h2>
            <p className="text-sm text-muted-foreground">Painel administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && <p className="text-sm text-destructiv">{erro}</p>}

            <Button type="submit" className="w-full hover:bg-brand/150" disabled={carregando}>
              {carregando ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
