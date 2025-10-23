import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Alert, AlertDescription } from "./ui/alert"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface RecuperarSenhaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecuperarSenhaModal({ isOpen, onClose }: RecuperarSenhaModalProps) {
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de envio de email
    setTimeout(() => {
      setEnviado(true)
      setLoading(false)
      toast.success("Email de recuperação enviado!")
    }, 2000)
  }

  const handleClose = () => {
    setEmail("")
    setEnviado(false)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Recuperar Senha</span>
          </DialogTitle>
          <DialogDescription>
            {!enviado 
              ? "Digite seu e-mail para receber instruções de recuperação"
              : "Verifique sua caixa de entrada"
            }
          </DialogDescription>
        </DialogHeader>

        {!enviado ? (
          <form onSubmit={handleEnviar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-recuperar">E-mail</Label>
              <Input
                id="email-recuperar"
                type="email"
                placeholder="seu.email@ibmec.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Alert>
              <AlertDescription>
                Enviaremos um link para redefinir sua senha. O link será válido por 24 horas.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enviamos um e-mail com instruções para <strong>{email}</strong>
              </p>
            </div>

            <Alert>
              <AlertDescription>
                • Verifique sua caixa de entrada e spam<br/>
                • O link expira em 24 horas<br/>
                • Se não receber, tente novamente
              </AlertDescription>
            </Alert>

            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}