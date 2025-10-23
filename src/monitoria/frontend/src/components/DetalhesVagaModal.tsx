import { X, Clock, MapPin, Users, Star, Calendar, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

interface DetalhesVagaModalProps {
  isOpen: boolean
  onClose: () => void
  vaga: {
    id: string
    titulo: string
    disciplina: string
    professor: string
    tipo: "horas_complementares" | "teaching_assistant"
    cargaHoraria: string
    local: string
    vagas: number
    candidatos: number
    requisitos: string[]
    descricao: string
    atividades: string[]
    cronograma: string
    beneficios: string[]
    contato: string
  } | null
  onCandidatar: (vagaId: string) => void
}

export function DetalhesVagaModal({ isOpen, onClose, vaga, onCandidatar }: DetalhesVagaModalProps) {
  if (!vaga) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Vaga</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho da vaga */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{vaga.titulo}</h2>
                <p className="text-xl text-muted-foreground">{vaga.disciplina}</p>
                <p className="text-lg">Prof. {vaga.professor}</p>
              </div>
              <Badge 
                variant={vaga.tipo === "teaching_assistant" ? "default" : "secondary"}
                className="text-lg px-4 py-2"
              >
                {vaga.tipo === "teaching_assistant" ? "Teaching Assistant" : "Horas Complementares"}
              </Badge>
            </div>


          </div>

          <Separator />

          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Carga Horária</p>
                  <p className="text-muted-foreground">{vaga.cargaHoraria}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Local</p>
                  <p className="text-muted-foreground">{vaga.local}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Vagas Disponíveis</p>
                  <p className="text-muted-foreground">{vaga.vagas} vagas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Candidatos</p>
                  <p className="text-muted-foreground">{vaga.candidatos} inscritos</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">{vaga.descricao}</p>
          </div>

          {/* Atividades */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Atividades do Monitor
            </h3>
            <ul className="space-y-2">
              {vaga.atividades.map((atividade, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{atividade}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requisitos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
            <div className="flex flex-wrap gap-2">
              {vaga.requisitos.map((requisito, index) => (
                <Badge key={index} variant="outline">
                  {requisito}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cronograma */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Cronograma
            </h3>
            <p className="text-muted-foreground">{vaga.cronograma}</p>
          </div>

          {/* Benefícios */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Benefícios</h3>
            <ul className="space-y-2">
              {vaga.beneficios.map((beneficio, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{beneficio}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Contato para Dúvidas</h4>
            <p className="text-muted-foreground">{vaga.contato}</p>
          </div>

          {/* Ações */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button 
              onClick={() => {
                onCandidatar(vaga.id)
                onClose()
              }}
              className="flex-1"
            >
              Candidatar-se
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}