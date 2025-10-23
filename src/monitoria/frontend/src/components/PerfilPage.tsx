import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { EditarPerfilModal } from "./EditarPerfilModal"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Award, 
  Edit,
  Github,
  Linkedin,
  Calendar,
  Star,
  Users,
  MessageCircle,
  UserPlus,
  UserMinus
} from "lucide-react"

interface PerfilPageProps {
  user: any
  onUpdateUser: (userData: any) => void
  isOwn?: boolean // Se é o próprio perfil do usuário
  onSeguir?: (userId: string) => void
  seguindo?: boolean
}

export function PerfilPage({ user, onUpdateUser, isOwn = true, onSeguir, seguindo = false }: PerfilPageProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Mock data para atividades e estatísticas
  const atividades = [
    {
      id: 1,
      tipo: "candidatura",
      titulo: "Se candidatou para Monitor de Cálculo I",
      data: "2024-01-15",
      status: "pendente"
    },
    {
      id: 2,
      tipo: "aprovacao",
      titulo: "Aprovado como Monitor de Microeconomia",
      data: "2024-01-10",
      status: "aprovado"
    },
    {
      id: 3,
      tipo: "monitoria",
      titulo: "Iniciou monitoria de Algoritmos",
      data: "2024-01-05",
      status: "ativo"
    }
  ]

  const estatisticas = {
    monitorias_ativas: 2,
    candidaturas_aprovadas: 3,
    avaliacoes_recebidas: 15,
    nota_media: 4.7,
    seguidores: 24,
    seguindo: 18
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header do Perfil */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl">
                    {user?.nome?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h1 className="text-2xl font-bold">{user?.nome}</h1>
                    <p className="text-muted-foreground">
                      {user?.tipo === "aluno" ? `${user?.curso} • ${user?.periodo}` : "Administrador"}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    {user?.telefone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{user?.telefone}</span>
                      </div>
                    )}
                    {user?.campus && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user?.campus}</span>
                      </div>
                    )}
                  </div>

                  {user?.bio && (
                    <p className="text-sm mt-3 max-w-2xl">{user?.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isOwn ? (
                  <Button onClick={() => setEditModalOpen(true)} className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Editar Perfil</span>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Mensagem</span>
                    </Button>
                    <Button 
                      onClick={() => onSeguir?.(user?.id)}
                      variant={seguindo ? "outline" : "default"}
                      className="flex items-center space-x-2"
                    >
                      {seguindo ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      <span>{seguindo ? "Deixar de Seguir" : "Seguir"}</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{estatisticas.monitorias_ativas}</div>
              <p className="text-sm text-muted-foreground">Monitorias Ativas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{estatisticas.candidaturas_aprovadas}</div>
              <p className="text-sm text-muted-foreground">Aprovações</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{estatisticas.nota_media}</span>
              </div>
              <p className="text-sm text-muted-foreground">Avaliação</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{estatisticas.seguidores}</div>
              <p className="text-sm text-muted-foreground">Seguidores</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{estatisticas.seguindo}</div>
              <p className="text-sm text-muted-foreground">Seguindo</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sobre" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
            {user?.tipo === "aluno" && <TabsTrigger value="monitorias">Monitorias</TabsTrigger>}
          </TabsList>

          {/* Tab Sobre */}
          <TabsContent value="sobre">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Acadêmicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Informações Acadêmicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user?.tipo === "aluno" && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Matrícula</p>
                        <p className="font-medium">{user?.matricula}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Curso</p>
                        <p className="font-medium">{user?.curso}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Período</p>
                        <p className="font-medium">{user?.periodo}</p>
                      </div>
                      {user?.cr && (
                        <div>
                          <p className="text-sm text-muted-foreground">CR</p>
                          <p className="font-medium">{user?.cr}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {user?.experiencia_monitoria && (
                    <div>
                      <p className="text-sm text-muted-foreground">Experiência em Monitoria</p>
                      <p className="text-sm">{user?.experiencia_monitoria}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Habilidades e Interesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Habilidades & Interesses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.habilidades?.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Habilidades</p>
                      <div className="flex flex-wrap gap-2">
                        {user.habilidades.map((habilidade: string, index: number) => (
                          <Badge key={index} variant="secondary">{habilidade}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user?.materias_interesse?.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Matérias de Interesse</p>
                      <div className="flex flex-wrap gap-2">
                        {user.materias_interesse.map((materia: string, index: number) => (
                          <Badge key={index} variant="outline">{materia}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex space-x-4 pt-2">
                    {user?.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {user?.github && (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Atividades */}
          <TabsContent value="atividades">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Histórico de atividades na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atividades.map(atividade => (
                    <div key={atividade.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{atividade.titulo}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={
                              atividade.status === "aprovado" ? "default" :
                              atividade.status === "pendente" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {atividade.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{atividade.data}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Monitorias */}
          {user?.tipo === "aluno" && (
            <TabsContent value="monitorias">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monitorias Ativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Monitor de Microeconomia</h4>
                            <p className="text-sm text-muted-foreground">Prof. Maria Oliveira • Campus Barra</p>
                          </div>
                          <Badge>Ativo</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Teaching Assistant - Algoritmos</h4>
                            <p className="text-sm text-muted-foreground">Prof. Carlos Santos • Campus Tijuca</p>
                          </div>
                          <Badge>Ativo</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Modal de Edição */}
      <EditarPerfilModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={onUpdateUser}
      />
    </div>
  )
}