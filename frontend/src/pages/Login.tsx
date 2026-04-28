import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    navigate('/')
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
                // required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                // required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
