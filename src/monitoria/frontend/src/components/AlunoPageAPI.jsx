import { useState, useEffect } from "react"
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
import { LogOut, User, Clock, CheckCircle, XCircle, Eye, Settings, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  listarVagasAbertas,
  listarCandidaturasPorAluno,
  criarCandidatura,
  
  
} from "../services/api"

export function AlunoPageAPI({ user, onLogout, onUpdateUser }) {
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [busca, setBusca] = useState("")
  const [filtroDisciplina, setFiltroDisciplina] = useState("Todas as disciplinas")
  const [candidaturaModalOpen, setCandidaturaModalOpen] = useState(false)
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false)
  const [vagaSelecionada, setVagaSelecionada] = useState(null)
  const [viewMode, setViewMode] = useState("vagas")
  
  // Estados para dados da API
  const [vagas, setVagas] = useState([])
  const [candidaturas, setCandidaturas] = useState([])
  const [loadingVagas, setLoadingVagas] = useState(true)
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(true)
  const [error, setError] = useState(null)

  // Carregar vagas abertas da API
  useEffect(() => {
    carregarVagas()
  }, [])

  // Carregar candidaturas do aluno
  useEffect(() => {
    if (user?.perfil?.id) {
      carregarCandidaturas()
    }
  }, [user])

  const carregarVagas = async () => {
    try {
      setLoadingVagas(true)
      setError(null)
      const vagasData = await listarVagasAbertas()
      setVagas(vagasData)
    } catch (err) {
      console.error("Erro ao carregar vagas:", err)
      setError("Erro ao carregar vagas. Tente novamente.")
      toast.error("Erro ao carregar vagas")
    } finally {
      setLoadingVagas(false)
    }
  }

  const carregarCandidaturas = async () => {
    try {
      setLoadingCandidaturas(true)
      const candidaturasData = await listarCandidaturasPorAluno(user.perfil.id)
      setCandidaturas(candidaturasData)
    } catch (err) {
      console.error("Erro ao carregar candidaturas:", err)
      toast.error("Erro ao carregar candidaturas")
    } finally {
      setLoadingCandidaturas(false)
    }
  }

  // Filtrar vagas
  const vagasFiltradas = vagas.filter(vaga => {
    const matchBusca = busca === "" || 
      vaga.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.professor_nome.toLowerCase().includes(busca.toLowerCase()) ||
      vaga.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchDisciplina = filtroDisciplina === "Todas as disciplinas" || vaga.disciplina === filtroDisciplina
    
    return matchBusca && matchDisciplina
  })

  const handleCandidatar = (vagaId) => {
    const vaga = vagas.find(v => v.id.toString() === vagaId)
    
    // Verificar se já se candidatou
    const jaCandidatou = candidaturas.some(c => c.vaga_id.toString() === vagaId)
    if (jaCandidatou) {
      toast.error("Você já se candidatou para esta vaga!")
      return
    }
    
    setVagaSelecionada(vaga || null)
    setCandidaturaModalOpen(true)
  }

  const handleVerDetalhes = (vagaId) => {
    const vaga = vagas.find(v => v.id.toString() === vagaId)
    setVagaSelecionada(vaga || null)
    setDetalhesModalOpen(true)
  }

  const handleSubmitCandidatura = async (dados) => {
    console.log("Candidatura enviada:", dados)
    
    try {
      if (!user?.perfil?.id) {
        toast.error("Erro: dados do aluno não encontrados")
        return
      }

      const novaCandidatura = await criarCandidatura({
        aluno_id: user.perfil.id,
        vaga_id: parseInt(dados.vagaId),
        status: "Pendente"
      })
      
      setCandidaturas([...candidaturas, novaCandidatura])
      toast.success("Candidatura enviada com sucesso!")
      setCandidaturaModalOpen(false)
    } catch (err) {
      console.error("Erro ao enviar candidatura:", err)
      toast.error(err instanceof Error ? err.message : "Erro ao enviar candidatura")
    }
  }

  const estatisticas = {
    totalCandidaturas: candidaturas.length,
    pendentes: candidaturas.filter(c => c.status.toLowerCase() === "pendente").length,
    aprovadas: candidaturas.filter(c => c.status.toLowerCase() === "aprovado").length,
    rejeitadas: candidaturas.filter(c => c.status.toLowerCase() === "rejeitado").length
  }

  const handleUpdateUser = (userData) => {
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Vagas de Monitoria</h1>
                  <p className="text-muted-foreground mb-4">
                    Encontre oportunidades de monitoria para ganhar experiência e desenvolver suas habilidades
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={carregarVagas}
                  disabled={loadingVagas}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingVagas ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </Button>
              </div>
              <div className="flex space-x-6 text-sm">
                <span><strong>{vagas.length}</strong> vagas disponíveis</span>
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

            {/* Estado de loading */}
            {loadingVagas && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Carregando vagas...</span>
              </div>
            )}

            {/* Estado de erro */}
            {error && !loadingVagas && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button onClick={carregarVagas}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            )}

            {/* Lista de vagas */}
            {!loadingVagas && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vagasFiltradas.map(vaga => {
                  const jaCandidatou = candidaturas.some(c => c.vaga_id === vaga.id)
                  
                  // Converter formato da API para formato do componente VagaCard
                  const vagaFormatada = {
                    id: vaga.id.toString(),
                    titulo: `Monitor de ${vaga.disciplina}`,
                    disciplina: vaga.disciplina,
                    professor: vaga.professor_nome,
                    tipo: "horas_complementares",
                    cargaHoraria: "8h/semana",
                    local: "Campus",
                    vagas: 2,
                    candidatos: 0,
                    requisitos: vaga.requisitos.split('\n').filter(r => r.trim()),
                    descricao: vaga.descricao,
                    atividades: [],
                    cronograma: "Semestre completo",
                    beneficios: [],
                    contato: ""
                  }

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
                        vaga={vagaFormatada}
                        onCandidatar={handleCandidatar}
                        onVerDetalhes={handleVerDetalhes}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {!loadingVagas && vagasFiltradas.length === 0 && !error && (
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={carregarCandidaturas}
                  disabled={loadingCandidaturas}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingCandidaturas ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </Button>
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

              {/* Loading de candidaturas */}
              {loadingCandidaturas && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Carregando candidaturas...</span>
                </div>
              )}

              {/* Lista de candidaturas */}
              {!loadingCandidaturas && (
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Candidaturas</CardTitle>
                    <CardDescription>Acompanhe o status das suas candidaturas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {candidaturas.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vaga</TableHead>
                            <TableHead>Professor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {candidaturas.map(candidatura => (
                            <TableRow key={candidatura.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">Monitor de {candidatura.vaga_disciplina}</p>
                                  <p className="text-sm text-muted-foreground">{candidatura.vaga_disciplina}</p>
                                </div>
                              </TableCell>
                              <TableCell>Prof. {candidatura.vaga.professor_nome}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    candidatura.status.toLowerCase() === "aprovado" ? "default" :
                                    candidatura.status.toLowerCase() === "rejeitado" ? "destructive" : "secondary"
                                  }
                                >
                                  {candidatura.status}
                                </Badge>
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
              )}
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
