import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Search, Filter, Eye, Edit, Trash2, UserX, UserCheck, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

interface GerenciarContasPageProps {
  onViewPerfil: (user: any) => void
}

// Mock data para usuários
const mockUsuarios = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@ibmec.edu.br",
    tipo: "aluno",
    matricula: "2022001234",
    curso: "Engenharia de Computação",
    periodo: "5º período",
    cr: "8.2",
    status: "ativo",
    dataCriacao: "2023-02-15",
    ultimoLogin: "2024-01-18"
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@ibmec.edu.br",
    tipo: "aluno",
    matricula: "2021005678",
    curso: "Administração",
    periodo: "7º período",
    cr: "9.1",
    status: "ativo",
    dataCriacao: "2022-08-10",
    ultimoLogin: "2024-01-18"
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro.costa@ibmec.edu.br",
    tipo: "aluno",
    matricula: "2023002468",
    curso: "Economia",
    periodo: "3º período",
    cr: "7.8",
    status: "inativo",
    dataCriacao: "2023-08-01",
    ultimoLogin: "2023-12-15"
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana.oliveira@ibmec.edu.br",
    tipo: "admin",
    cargo: "Coordenadora Acadêmica",
    status: "ativo",
    dataCriacao: "2020-01-15",
    ultimoLogin: "2024-01-18"
  },
  {
    id: "5",
    nome: "Carlos Santos",
    email: "carlos.santos@ibmec.edu.br",
    tipo: "professor",
    departamento: "Computação",
    status: "ativo",
    dataCriacao: "2019-03-20",
    ultimoLogin: "2024-01-17"
  }
]

export function GerenciarContasPage({ onViewPerfil }: GerenciarContasPageProps) {
  const [usuarios, setUsuarios] = useState(mockUsuarios)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null)
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false)

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusca = busca === "" || 
      usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      (usuario.matricula && usuario.matricula.includes(busca))
    
    const matchTipo = filtroTipo === "todos" || usuario.tipo === filtroTipo
    const matchStatus = filtroStatus === "todos" || usuario.status === filtroStatus
    
    return matchBusca && matchTipo && matchStatus
  })

  const handleAlterarStatus = (usuarioId: string, novoStatus: "ativo" | "inativo") => {
    setUsuarios(usuarios.map(user => 
      user.id === usuarioId ? { ...user, status: novoStatus } : user
    ))
    toast.success(`Usuário ${novoStatus === "ativo" ? "ativado" : "desativado"} com sucesso!`)
  }

  const handleExcluirUsuario = (usuarioId: string) => {
    setUsuarios(usuarios.filter(user => user.id !== usuarioId))
    toast.success("Usuário excluído com sucesso!")
  }

  const handleVerDetalhes = (usuario: any) => {
    setUsuarioSelecionado(usuario)
    setDetalhesModalOpen(true)
  }

  const estatisticas = {
    totalUsuarios: usuarios.length,
    usuariosAtivos: usuarios.filter(u => u.status === "ativo").length,
    alunos: usuarios.filter(u => u.tipo === "aluno").length,
    professores: usuarios.filter(u => u.tipo === "professor").length,
    admins: usuarios.filter(u => u.tipo === "admin").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Contas</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{estatisticas.totalUsuarios}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{estatisticas.usuariosAtivos}</div>
            <p className="text-sm text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{estatisticas.alunos}</div>
            <p className="text-sm text-muted-foreground">Alunos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{estatisticas.professores}</div>
            <p className="text-sm text-muted-foreground">Professores</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{estatisticas.admins}</div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, e-mail ou matrícula..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aluno">Alunos</SelectItem>
                <SelectItem value="professor">Professores</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({usuariosFiltrados.length})</CardTitle>
          <CardDescription>Gerencie as contas de usuários da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Informações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map(usuario => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {usuario.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={
                      usuario.tipo === "admin" ? "default" :
                      usuario.tipo === "professor" ? "secondary" : "outline"
                    }>
                      {usuario.tipo === "aluno" ? "Aluno" :
                       usuario.tipo === "professor" ? "Professor" : "Admin"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {usuario.tipo === "aluno" ? (
                      <div className="text-sm">
                        <p>Mat: {usuario.matricula}</p>
                        <p>{usuario.curso}</p>
                        <p>CR: {usuario.cr}</p>
                      </div>
                    ) : usuario.tipo === "professor" ? (
                      <div className="text-sm">
                        <p>Dept: {usuario.departamento}</p>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p>{usuario.cargo}</p>
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>
                      {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm">{usuario.ultimoLogin}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerDetalhes(usuario)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAlterarStatus(
                          usuario.id, 
                          usuario.status === "ativo" ? "inativo" : "ativo"
                        )}
                      >
                        {usuario.status === "ativo" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleExcluirUsuario(usuario.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesModalOpen} onOpenChange={setDetalhesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Conta</DialogTitle>
          </DialogHeader>
          
          {usuarioSelecionado && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">
                    {usuarioSelecionado.nome.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{usuarioSelecionado.nome}</h3>
                  <p className="text-muted-foreground">{usuarioSelecionado.email}</p>
                  <Badge className="mt-1">
                    {usuarioSelecionado.tipo === "aluno" ? "Aluno" :
                     usuarioSelecionado.tipo === "professor" ? "Professor" : "Admin"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={usuarioSelecionado.status === "ativo" ? "default" : "secondary"}>
                    {usuarioSelecionado.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p>{usuarioSelecionado.dataCriacao}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Último Login</p>
                  <p>{usuarioSelecionado.ultimoLogin}</p>
                </div>
                
                {usuarioSelecionado.tipo === "aluno" && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Matrícula</p>
                      <p>{usuarioSelecionado.matricula}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Curso</p>
                      <p>{usuarioSelecionado.curso}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p>{usuarioSelecionado.periodo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CR</p>
                      <p>{usuarioSelecionado.cr}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => onViewPerfil(usuarioSelecionado)} className="flex-1">
                  Ver Perfil Completo
                </Button>
                <Button variant="outline" onClick={() => setDetalhesModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}