import { Clock, MapPin, Users, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface VagaCardProps {
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
  }
  onCandidatar: (vagaId: string) => void
  onVerDetalhes: (vagaId: string) => void
}

export function VagaCard({ vaga, onCandidatar, onVerDetalhes }: VagaCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
            <p className="text-muted-foreground">{vaga.disciplina}</p>
            <p className="text-sm">Prof. {vaga.professor}</p>
          </div>
          <Badge 
            variant={vaga.tipo === "teaching_assistant" ? "default" : "secondary"}
            className="ml-2"
          >
            {vaga.tipo === "teaching_assistant" ? "Teaching Assistant" : "Horas Complementares"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{vaga.cargaHoraria}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{vaga.local}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{vaga.vagas} vagas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{vaga.candidatos} candidatos</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Requisitos:</span> {vaga.requisitos.join(", ")}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {vaga.descricao}
          </p>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={() => onVerDetalhes(vaga.id)}
            variant="outline" 
            className="flex-1"
          >
            Ver Detalhes
          </Button>
          <Button 
            onClick={() => onCandidatar(vaga.id)}
            className="flex-1"
          >
            Candidatar-se
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}