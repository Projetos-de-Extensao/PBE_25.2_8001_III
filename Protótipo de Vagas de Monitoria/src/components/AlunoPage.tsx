import { useState } from "react"
import { Header } from "./Header"
import { FiltrosVagas } from "./FiltrosVagas"
import { VagaCard } from "./VagaCard"
import { CandidaturaModal } from "./CandidaturaModal"
import { DetalhesVagaModal } from "./DetalhesVagaModal"
import { PerfilPage } from "./PerfilPage"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { LogOut, User, Clock, CheckCircle, XCircle, Eye, Settings } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface AlunoPageProps {
  user: any
  onLogout: () => void
  onUpdateUser?: (userData: any) => void
}

// Mock data para as vagas
const mockVagas = [
  {
    id: "1",
    titulo: "Monitor de Cálculo I",
    disciplina: "Matemática",
    professor: "Ana Silva",
    tipo: "horas_complementares" as const,
    cargaHoraria: "8h/semana",
    local: "Campus Barra",
    vagas: 2,
    candidatos: 8,
    requisitos: ["CR ≥ 7.0", "Cursou Cálculo I", "2º período ou superior"],
    descricao: "Auxiliar estudantes com dificuldades em Cálculo I, dar plantões de dúvidas e ajudar em exercícios práticos.",
    atividades: [
      "Plantão de dúvidas 2x por semana",
      "Auxílio em listas de exercícios",
      "Suporte em horários de estudo",
      "Preparação de material didático simples"
    ],
    cronograma: "Início: Março 2024 | Duração: Semestre completo",
    beneficios: [
      "20 horas complementares por semestre",
      "Certificado de monitoria",
      "Experiência didática",
      "Networking com professores"
    ],
    contato: "prof.ana.silva@ibmec.edu.br"
  },
  {
    id: "2", 
    titulo: "Teaching Assistant - Programação Java",
    disciplina: "Programação",
    professor: "Carlos Santos",
    tipo: "teaching_assistant" as const,
    cargaHoraria: "12h/semana",
    local: "Campus Tijuca",
    vagas: 1,
    candidatos: 15,
    requisitos: ["CR ≥ 8.0", "Java avançado", "4º período ou superior"],
    descricao: "Teaching Assistant especializado em Java para turmas avançadas, incluindo frameworks Spring e desenvolvimento web.",
    atividades: [
      "Aulas de reforço em Java",
      "Correção de projetos práticos",
      "Desenvolvimento de tutoriais",
      "Suporte em projetos finais"
    ],
    cronograma: "Início: Março 2024 | Duração: Ano letivo completo",
    beneficios: [
      "Experiência acadêmica avançada",
      "Certificado de Teaching Assistant",
      "Networking com professores e alunos",
      "Desenvolvimento de habilidades de ensino"
    ],
    contato: "prof.carlos.santos@ibmec.edu.br"
  },
  {
    id: "3",
    titulo: "Monitor de Microeconomia",
    disciplina: "Economia", 
    professor: "Maria Oliveira",
    tipo: "horas_complementares" as const,
    cargaHoraria: "6h/semana",
    local: "Campus Barra",
    vagas: 3,
    candidatos: 5,
    requisitos: ["CR ≥ 6.5", "Cursou Microeconomia", "3º período ou superior"],
    descricao: "Apoio a estudantes em conceitos fundamentais de microeconomia e resolução de exercícios.",
    atividades: [
      "Revisão de conceitos teóricos",
      "Resolução de exercícios em grupo",
      "Preparação para provas",
      "Esclarecimento de dúvidas individuais"
    ],
    cronograma: "Início: Março 2024 | Duração: Semestre completo", 
    beneficios: [
      "15 horas complementares por semestre",
      "Certificado de monitoria",
      "Aprofundamento em economia",
      "Experiência didática"
    ],
    contato: "prof.maria.oliveira@ibmec.edu.br"
  },
  {
    id: "4",
    titulo: "Teaching Assistant - Laboratório de Física",
    disciplina: "Física",
    professor: "João Pedro",
    tipo: "teaching_assistant" as const,
    cargaHoraria: "10h/semana",
    local: "Campus Tijuca",
    vagas: 2,
    candidatos: 12,
    requisitos: ["CR ≥ 7.5", "Física Experimental", "3º período ou superior"],
    descricao: "Teaching Assistant para auxiliar em aulas práticas de laboratório, manutenção de equipamentos e orientação em experimentos.",
    atividades: [
      "Preparação de experimentos",
      "Orientação durante aulas práticas",
      "Manutenção básica de equipamentos",
      "Elaboração de relatórios"
    ],
    cronograma: "Início: Março 2024 | Duração: Ano letivo completo",
    beneficios: [
      "Experiência avançada em laboratório",
      "Certificado de Teaching Assistant",
      "Acesso a equipamentos avançados",
      "Desenvolvimento de competências técnicas"
    ],
    contato: "prof.joao.pedro@ibmec.edu.br"
  }
]

// Mock data para candidaturas do aluno
const mockMinhasCandidaturas = [
  {
    id: "1",
    vagaId: "1",
    vagaTitulo: "Monitor de Cálculo I",
    disciplina: "Matemática",
    professor: "Ana Silva",
    status: "pendente",
    dataEnvio: "2024-01-15",
    feedback: ""
  },
  {
    id: "2",
    vagaId: "3",
    vagaTitulo: "Monitor de Microeconomia",
    disciplina: "Economia",
    professor: "Maria Oliveira",
    status: "aprovado",
    dataEnvio: "2024-01-10",
    feedback: "Parabéns! Você foi selecionado para a vaga de monitor."
  },
  {
    id: "3",
    vagaId: "2",
    vagaTitulo: "Teaching Assistant - Programação Java",
    disciplina: "Programação",
    professor: "Carlos Santos",
    status: "rejeitado",
    dataEnvio: "2024-01-08",
    feedback: "Infelizmente não foi selecionado desta vez. Continue se candidatando!"
  }
]

export function AlunoPage({ user, onLogout, onUpdateUser }: AlunoPageProps) {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "horas_complementares" | "teaching_assistant">("todos")
  const [busca, setBusca] = useState("")
  const [filtroDisciplina, setFiltroDisciplina] = useState("Todas as disciplinas")
  const [candidaturaModalOpen, setCandidaturaModalOpen] = useState(false)
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false)
  const [vagaSelecionada, setVagaSelecionada] = useState<typeof mockVagas[0] | null>(null)
  const [minhasCandidaturas, setMinhasCandidaturas] = useState(mockMinhasCandidaturas)
  const [viewMode, setViewMode] = useState<"vagas" | "perfil">("vagas")

  // Filtrar vagas
  const vagasFiltradas = mockVagas.filter(vaga => {
    const matchTipo = filtroTipo === "todos" || vaga.tipo === filtroTipo
    const matchBusca = busca === "" || 
      vaga.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.professor.toLowerCase().includes(busca.toLowerCase())
    const matchDisciplina = filtroDisciplina === "Todas as disciplinas" || vaga.disciplina === filtroDisciplina
    
    return matchTipo && matchBusca && matchDisciplina
  })

  const handleCandidatar = (vagaId: string) => {
    const vaga = mockVagas.find(v => v.id === vagaId)
    
    // Verificar se já se candidatou
    const jaCandidatou = minhasCandidaturas.some(c => c.vagaId === vagaId)
    if (jaCandidatou) {
      toast.error("Você já se candidatou para esta vaga!")
      return
    }
    
    setVagaSelecionada(vaga || null)
    setCandidaturaModalOpen(true)
  }

  const handleVerDetalhes = (vagaId: string) => {
    const vaga = mockVagas.find(v => v.id === vagaId)
    setVagaSelecionada(vaga || null)
    setDetalhesModalOpen(true)
  }

  const handleSubmitCandidatura = (dados: any) => {
    console.log("Candidatura enviada:", dados)
    
    // Adicionar nova candidatura
    const novaCandidatura = {
      id: (minhasCandidaturas.length + 1).toString(),
      vagaId: dados.vagaId,
      vagaTitulo: vagaSelecionada?.titulo || "",
      disciplina: vagaSelecionada?.disciplina || "",
      professor: vagaSelecionada?.professor || "",
      status: "pendente",
      dataEnvio: new Date().toISOString().split('T')[0],
      feedback: ""
    }
    
    setMinhasCandidaturas([...minhasCandidaturas, novaCandidatura])
    toast.success("Candidatura enviada com sucesso!")
  }

  const estatisticas = {
    totalCandidaturas: minhasCandidaturas.length,
    pendentes: minhasCandidaturas.filter(c => c.status === "pendente").length,
    aprovadas: minhasCandidaturas.filter(c => c.status === "aprovado").length,
    rejeitadas: minhasCandidaturas.filter(c => c.status === "rejeitado").length
  }

  const handleUpdateUser = (userData: any) => {
    if (onUpdateUser) {
      onUpdateUser(userData)
    }
  }

  // Se estiver visualizando perfil
  if (viewMode === "perfil") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setViewMode("vagas")}
                className="flex items-center space-x-2"
              >
                ← Voltar às Vagas
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </header>
        <PerfilPage user={user} onUpdateUser={handleUpdateUser} isOwn={true} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header personalizado para aluno */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">I</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">IBMEC Monitoria</h1>
                  <p className="text-sm text-muted-foreground">Bem-vindo, {user.nome}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.matricula} • {user.periodo}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setViewMode("perfil")}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Meu Perfil</span>
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vagas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vagas">Vagas Disponíveis</TabsTrigger>
            <TabsTrigger value="candidaturas" className="flex items-center space-x-2">
              <span>Minhas Candidaturas</span>
              {estatisticas.pendentes > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {estatisticas.pendentes}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab Vagas Disponíveis */}
          <TabsContent value="vagas">
            {/* Título e estatísticas */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Vagas de Monitoria</h1>
              <p className="text-muted-foreground mb-4">
                Encontre oportunidades de monitoria para ganhar experiência e desenvolver suas habilidades
              </p>
              <div className="flex space-x-6 text-sm">
                <span><strong>{mockVagas.length}</strong> vagas disponíveis</span>
                <span><strong>{mockVagas.filter(v => v.tipo === "teaching_assistant").length}</strong> Teaching Assistant</span>
                <span><strong>{mockVagas.filter(v => v.tipo === "horas_complementares").length}</strong> para horas complementares</span>
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-8">
              <FiltrosVagas
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                busca={busca}
                setBusca={setBusca}
                filtroDisciplina={filtroDisciplina}
                setFiltroDisciplina={setFiltroDisciplina}
              />
            </div>

            {/* Lista de vagas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagasFiltradas.map(vaga => {
                const jaCandidatou = minhasCandidaturas.some(c => c.vagaId === vaga.id)
                return (
                  <div key={vaga.id} className="relative">
                    {jaCandidatou && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Candidatura Enviada
                        </Badge>
                      </div>
                    )}
                    <VagaCard
                      vaga={vaga}
                      onCandidatar={handleCandidatar}
                      onVerDetalhes={handleVerDetalhes}
                    />
                  </div>
                )
              })}
            </div>

            {vagasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhuma vaga encontrada com os filtros aplicados.
                </p>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou fazer uma nova busca.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Tab Minhas Candidaturas */}
          <TabsContent value="candidaturas">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Minhas Candidaturas</h2>
              </div>

              {/* Estatísticas das candidaturas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estatisticas.totalCandidaturas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estatisticas.pendentes}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{estatisticas.aprovadas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{estatisticas.rejeitadas}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de candidaturas */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Candidaturas</CardTitle>
                  <CardDescription>Acompanhe o status das suas candidaturas</CardDescription>
                </CardHeader>
                <CardContent>
                  {minhasCandidaturas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vaga</TableHead>
                          <TableHead>Professor</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Feedback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {minhasCandidaturas.map(candidatura => (
                          <TableRow key={candidatura.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{candidatura.vagaTitulo}</p>
                                <p className="text-sm text-muted-foreground">{candidatura.disciplina}</p>
                              </div>
                            </TableCell>
                            <TableCell>Prof. {candidatura.professor}</TableCell>
                            <TableCell>{candidatura.dataEnvio}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  candidatura.status === "aprovado" ? "default" :
                                  candidatura.status === "rejeitado" ? "destructive" : "secondary"
                                }
                              >
                                {candidatura.status === "aprovado" ? "Aprovado" :
                                 candidatura.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {candidatura.feedback ? (
                                <p className="text-sm">{candidatura.feedback}</p>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Você ainda não se candidatou para nenhuma vaga.
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        Explore as vagas disponíveis e candidate-se!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <CandidaturaModal
        isOpen={candidaturaModalOpen}
        onClose={() => setCandidaturaModalOpen(false)}
        vaga={vagaSelecionada}
        onSubmit={handleSubmitCandidatura}
      />

      <DetalhesVagaModal
        isOpen={detalhesModalOpen}
        onClose={() => setDetalhesModalOpen(false)}
        vaga={vagaSelecionada}
        onCandidatar={handleCandidatar}
      />
    </div>
  )
}