import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { GerenciarContasPage } from "./GerenciarContasPage"
import { PerfilPage } from "./PerfilPage"
import { Plus, Edit, Trash2, Users, BookOpen, Clock, Eye, CheckCircle, XCircle, LogOut, UserCog } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

// Mock data para candidaturas
const mockCandidaturas = [
  {
    id: "1",
    vagaId: "1",
    vagaTitulo: "Monitor de Cálculo I",
    candidato: "João Silva",
    email: "joao.silva@ibmec.edu.br",
    matricula: "2022001234",
    periodo: "4º período",
    cr: "8.2",
    status: "pendente",
    dataEnvio: "2024-01-15"
  },
  {
    id: "2",
    vagaId: "2",
    vagaTitulo: "Teaching Assistant - Programação Java",
    candidato: "Maria Santos",
    email: "maria.santos@ibmec.edu.br",
    matricula: "2021005678",
    periodo: "6º período",
    cr: "9.1",
    status: "aprovado",
    dataEnvio: "2024-01-14"
  },
  {
    id: "3",
    vagaId: "1",
    vagaTitulo: "Monitor de Cálculo I",
    candidato: "Pedro Costa",
    email: "pedro.costa@ibmec.edu.br",
    matricula: "2022002468",
    periodo: "3º período",
    cr: "7.8",
    status: "rejeitado",
    dataEnvio: "2024-01-13"
  }
]

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [vagas, setVagas] = useState([
    {
      id: "1",
      titulo: "Monitor de Cálculo I",
      disciplina: "Matemática",
      professor: "Ana Silva",
      tipo: "horas_complementares",
      cargaHoraria: "8h/semana",
      local: "Campus Barra",
      vagas: 2,
      candidatos: 8,
      status: "ativa"
    },
    {
      id: "2",
      titulo: "Teaching Assistant - Programação Java",
      disciplina: "Programação",
      professor: "Carlos Santos",
      tipo: "teaching_assistant",
      cargaHoraria: "12h/semana",
      local: "Campus Tijuca",
      vagas: 1,
      candidatos: 15,
      status: "ativa"
    }
  ])

  const [candidaturas, setCandidaturas] = useState(mockCandidaturas)
  const [novaVagaOpen, setNovaVagaOpen] = useState(false)
  const [editandoVaga, setEditandoVaga] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"dashboard" | "contas" | "perfil">("dashboard")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  const [formVaga, setFormVaga] = useState({
    titulo: "",
    disciplina: "",
    professor: "",
    tipo: "horas_complementares",
    cargaHoraria: "",
    local: "",
    vagas: "",
    requisitos: "",
    descricao: "",
    atividades: "",
    beneficios: "",
    contato: ""
  })

  const handleCriarVaga = (e: React.FormEvent) => {
    e.preventDefault()
    const novaVaga = {
      id: (vagas.length + 1).toString(),
      ...formVaga,
      vagas: parseInt(formVaga.vagas),
      candidatos: 0,
      status: "ativa"
    }
    setVagas([...vagas, novaVaga])
    setNovaVagaOpen(false)
    setFormVaga({
      titulo: "",
      disciplina: "",
      professor: "",
      tipo: "horas_complementares",
      cargaHoraria: "",
      local: "",
      vagas: "",
      requisitos: "",
      descricao: "",
      atividades: "",
      beneficios: "",
      contato: ""
    })
    toast.success("Vaga criada com sucesso!")
  }

  const handleEditarVaga = (vaga: any) => {
    setEditandoVaga(vaga)
    setFormVaga({
      titulo: vaga.titulo,
      disciplina: vaga.disciplina,
      professor: vaga.professor,
      tipo: vaga.tipo,
      cargaHoraria: vaga.cargaHoraria,
      local: vaga.local,
      vagas: vaga.vagas.toString(),
      requisitos: "",
      descricao: "",
      atividades: "",
      beneficios: "",
      contato: ""
    })
  }

  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault()
    const vagasAtualizadas = vagas.map(v => 
      v.id === editandoVaga.id 
        ? { ...v, ...formVaga, vagas: parseInt(formVaga.vagas) }
        : v
    )
    setVagas(vagasAtualizadas)
    setEditandoVaga(null)
    toast.success("Vaga atualizada com sucesso!")
  }

  const handleExcluirVaga = (vagaId: string) => {
    const vagasAtualizadas = vagas.filter(v => v.id !== vagaId)
    setVagas(vagasAtualizadas)
    toast.success("Vaga excluída com sucesso!")
  }

  const handleAtualizarStatusCandidatura = (candidaturaId: string, novoStatus: string) => {
    const candidaturasAtualizadas = candidaturas.map(c =>
      c.id === candidaturaId ? { ...c, status: novoStatus } : c
    )
    setCandidaturas(candidaturasAtualizadas)
    toast.success(`Candidatura ${novoStatus}!`)
  }

  const handleViewPerfil = (user: any) => {
    setSelectedUser(user)
    setViewMode("perfil")
  }

  const handleUpdateUser = (userData: any) => {
    // Em uma aplicação real, aqui faria a atualização no backend
    console.log("Atualizando dados do usuário:", userData)
  }

  // Se estiver visualizando perfil de usuário
  if (viewMode === "perfil" && selectedUser) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setViewMode("contas")}
                className="flex items-center space-x-2"
              >
                ← Voltar para Contas
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </header>
        <PerfilPage 
          user={selectedUser} 
          onUpdateUser={handleUpdateUser}
          isOwn={false}
        />
      </div>
    )
  }

  // Se estiver na página de gerenciar contas
  if (viewMode === "contas") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode("dashboard")}
                  className="flex items-center space-x-2"
                >
                  ← Voltar ao Dashboard
                </Button>
                <div>
                  <h1 className="text-xl font-bold">IBMEC Monitoria - Gerenciar Contas</h1>
                  <p className="text-sm text-muted-foreground">Administração de usuários</p>
                </div>
              </div>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <GerenciarContasPage onViewPerfil={handleViewPerfil} />
        </main>
      </div>
    )
  }

  const estatisticas = {
    totalVagas: vagas.length,
    vagasAtivas: vagas.filter(v => v.status === "ativa").length,
    totalCandidaturas: candidaturas.length,
    candidaturasPendentes: candidaturas.filter(c => c.status === "pendente").length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Admin */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">I</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">IBMEC Monitoria - Admin</h1>
                  <p className="text-sm text-muted-foreground">Olá, {user.nome}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalVagas}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.vagasAtivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalCandidaturas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.candidaturasPendentes}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vagas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vagas">Gerenciar Vagas</TabsTrigger>
            <TabsTrigger value="candidaturas">Candidaturas</TabsTrigger>
            <TabsTrigger value="contas" onClick={() => setViewMode("contas")}>
              <UserCog className="h-4 w-4 mr-2" />
              Gerenciar Contas
            </TabsTrigger>
          </TabsList>

          {/* Tab Vagas */}
          <TabsContent value="vagas">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Vagas de Monitoria</h2>
                <Dialog open={novaVagaOpen} onOpenChange={setNovaVagaOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Nova Vaga</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Vaga</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCriarVaga} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="titulo">Título da Vaga *</Label>
                          <Input
                            id="titulo"
                            value={formVaga.titulo}
                            onChange={(e) => setFormVaga({...formVaga, titulo: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="disciplina">Disciplina *</Label>
                          <Input
                            id="disciplina"
                            value={formVaga.disciplina}
                            onChange={(e) => setFormVaga({...formVaga, disciplina: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="professor">Professor *</Label>
                          <Input
                            id="professor"
                            value={formVaga.professor}
                            onChange={(e) => setFormVaga({...formVaga, professor: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="tipo">Tipo *</Label>
                          <Select value={formVaga.tipo} onValueChange={(value) => setFormVaga({...formVaga, tipo: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horas_complementares">Horas Complementares</SelectItem>
                              <SelectItem value="teaching_assistant">Teaching Assistant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cargaHoraria">Carga Horária *</Label>
                          <Input
                            id="cargaHoraria"
                            placeholder="Ex: 8h/semana"
                            value={formVaga.cargaHoraria}
                            onChange={(e) => setFormVaga({...formVaga, cargaHoraria: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="local">Local *</Label>
                          <Input
                            id="local"
                            placeholder="Ex: Campus Barra"
                            value={formVaga.local}
                            onChange={(e) => setFormVaga({...formVaga, local: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="vagas">Nº de Vagas *</Label>
                          <Input
                            id="vagas"
                            type="number"
                            min="1"
                            value={formVaga.vagas}
                            onChange={(e) => setFormVaga({...formVaga, vagas: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="descricao">Descrição *</Label>
                        <Textarea
                          id="descricao"
                          value={formVaga.descricao}
                          onChange={(e) => setFormVaga({...formVaga, descricao: e.target.value})}
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="contato">Contato *</Label>
                        <Input
                          id="contato"
                          type="email"
                          placeholder="professor@ibmec.edu.br"
                          value={formVaga.contato}
                          onChange={(e) => setFormVaga({...formVaga, contato: e.target.value})}
                          required
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setNovaVagaOpen(false)} className="flex-1">
                          Cancelar
                        </Button>
                        <Button type="submit" className="flex-1">
                          Criar Vaga
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {vagas.map(vaga => (
                  <Card key={vaga.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{vaga.titulo}</CardTitle>
                          <CardDescription>{vaga.disciplina} - Prof. {vaga.professor}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={vaga.tipo === "teaching_assistant" ? "default" : "secondary"}>
                            {vaga.tipo === "teaching_assistant" ? "Teaching Assistant" : "Horas Complementares"}
                          </Badge>
                          <Badge variant="outline">
                            {vaga.candidatos} candidatos
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{vaga.cargaHoraria} • {vaga.local}</p>
                          <p>{vaga.vagas} vagas disponíveis</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditarVaga(vaga)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleExcluirVaga(vaga.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab Candidaturas */}
          <TabsContent value="candidaturas">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Candidaturas Recebidas</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Candidaturas</CardTitle>
                  <CardDescription>Gerencie as candidaturas recebidas para as vagas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidato</TableHead>
                        <TableHead>Vaga</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>CR</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidaturas.map(candidatura => (
                        <TableRow key={candidatura.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{candidatura.candidato}</p>
                              <p className="text-sm text-muted-foreground">{candidatura.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{candidatura.vagaTitulo}</TableCell>
                          <TableCell>{candidatura.matricula}</TableCell>
                          <TableCell>{candidatura.cr}</TableCell>
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
                          <TableCell>{candidatura.dataEnvio}</TableCell>
                          <TableCell>
                            {candidatura.status === "pendente" && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleAtualizarStatusCandidatura(candidatura.id, "aprovado")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleAtualizarStatusCandidatura(candidatura.id, "rejeitado")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Edição */}
      {editandoVaga && (
        <Dialog open={!!editandoVaga} onOpenChange={() => setEditandoVaga(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Vaga</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titulo-edit">Título da Vaga *</Label>
                  <Input
                    id="titulo-edit"
                    value={formVaga.titulo}
                    onChange={(e) => setFormVaga({...formVaga, titulo: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="disciplina-edit">Disciplina *</Label>
                  <Input
                    id="disciplina-edit"
                    value={formVaga.disciplina}
                    onChange={(e) => setFormVaga({...formVaga, disciplina: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="professor-edit">Professor *</Label>
                  <Input
                    id="professor-edit"
                    value={formVaga.professor}
                    onChange={(e) => setFormVaga({...formVaga, professor: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vagas-edit">Nº de Vagas *</Label>
                  <Input
                    id="vagas-edit"
                    type="number"
                    min="1"
                    value={formVaga.vagas}
                    onChange={(e) => setFormVaga({...formVaga, vagas: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditandoVaga(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}