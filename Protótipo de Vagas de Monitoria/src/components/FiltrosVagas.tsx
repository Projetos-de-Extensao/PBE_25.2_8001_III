import { Search, Filter } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface FiltrosVagasProps {
  filtroTipo: "todos" | "horas_complementares" | "teaching_assistant"
  setFiltroTipo: (tipo: "todos" | "horas_complementares" | "teaching_assistant") => void
  busca: string
  setBusca: (busca: string) => void
  filtroDisciplina: string
  setFiltroDisciplina: (disciplina: string) => void
}

export function FiltrosVagas({ 
  filtroTipo, 
  setFiltroTipo, 
  busca, 
  setBusca,
  filtroDisciplina,
  setFiltroDisciplina 
}: FiltrosVagasProps) {
  const disciplinas = [
    "Todas as disciplinas",
    "Matemática",
    "Física",
    "Química", 
    "Programação",
    "Economia",
    "Administração",
    "Contabilidade",
    "Direito"
  ]

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por disciplina, professor ou palavra-chave..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros principais */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        {/* Filtro por tipo */}
        <div className="flex space-x-2">
          <Badge
            variant={filtroTipo === "todos" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFiltroTipo("todos")}
          >
            Todas
          </Badge>
          <Badge
            variant={filtroTipo === "horas_complementares" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFiltroTipo("horas_complementares")}
          >
            Horas Complementares
          </Badge>
          <Badge
            variant={filtroTipo === "teaching_assistant" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFiltroTipo("teaching_assistant")}
          >
            Teaching Assistant
          </Badge>
        </div>

        {/* Filtro por disciplina */}
        <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecionar disciplina" />
          </SelectTrigger>
          <SelectContent>
            {disciplinas.map((disciplina) => (
              <SelectItem key={disciplina} value={disciplina}>
                {disciplina}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}