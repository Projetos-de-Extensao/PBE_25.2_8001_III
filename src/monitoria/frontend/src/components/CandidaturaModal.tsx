import { useState } from "react"
import { X, Upload, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"

interface CandidaturaModalProps {
  isOpen: boolean
  onClose: () => void
  vaga: {
    id: string
    titulo: string
    disciplina: string
    professor: string
    tipo: "horas_complementares" | "teaching_assistant"
    requisitos: string[]
  } | null
  onSubmit: (dados: any) => void
}

export function CandidaturaModal({ isOpen, onClose, vaga, onSubmit }: CandidaturaModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    periodo: "",
    crCoeficiente: "",
    telefone: "",
    email: "",
    experiencia: "",
    motivacao: "",
    disponibilidade: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, vagaId: vaga?.id })
    onClose()
    // Reset form
    setFormData({
      nome: "",
      matricula: "",
      periodo: "",
      crCoeficiente: "",
      telefone: "",
      email: "",
      experiencia: "",
      motivacao: "",
      disponibilidade: ""
    })
  }

  if (!vaga) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Candidatar-se para Monitoria</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da vaga */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium">{vaga.titulo}</h3>
            <p className="text-sm text-muted-foreground">{vaga.disciplina} - Prof. {vaga.professor}</p>
            <div className="mt-2">
              <Badge variant={vaga.tipo === "teaching_assistant" ? "default" : "secondary"}>
                {vaga.tipo === "teaching_assistant" ? "Teaching Assistant" : "Horas Complementares"}
              </Badge>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Requisitos: {vaga.requisitos.join(", ")}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados pessoais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="periodo">Período Atual *</Label>
                <Input
                  id="periodo"
                  placeholder="Ex: 5º período"
                  value={formData.periodo}
                  onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="crCoeficiente">CR/Coeficiente *</Label>
                <Input
                  id="crCoeficiente"
                  placeholder="Ex: 8.5"
                  value={formData.crCoeficiente}
                  onChange={(e) => setFormData({...formData, crCoeficiente: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Informações específicas */}
            <div>
              <Label htmlFor="experiencia">Experiência Prévia</Label>
              <Textarea
                id="experiencia"
                placeholder="Descreva experiências anteriores como monitor, tutor ou em áreas relacionadas..."
                value={formData.experiencia}
                onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="motivacao">Motivação *</Label>
              <Textarea
                id="motivacao"
                placeholder="Por que você quer ser monitor desta disciplina? Como pode contribuir?"
                value={formData.motivacao}
                onChange={(e) => setFormData({...formData, motivacao: e.target.value})}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="disponibilidade">Disponibilidade de Horários *</Label>
              <Textarea
                id="disponibilidade"
                placeholder="Informe seus horários disponíveis para as atividades de monitoria..."
                value={formData.disponibilidade}
                onChange={(e) => setFormData({...formData, disponibilidade: e.target.value})}
                rows={2}
                required
              />
            </div>

            {/* Upload de documentos (simulado) */}
            <div>
              <Label>Histórico Escolar (opcional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clique para fazer upload ou arraste o arquivo aqui
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, máximo 5MB
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Enviar Candidatura
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}