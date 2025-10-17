import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { User, Mail, Phone, MapPin, BookOpen, Award, Camera } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface EditarPerfilModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onSave: (userData: any) => void
}

export function EditarPerfilModal({ isOpen, onClose, user, onSave }: EditarPerfilModalProps) {
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    bio: user?.bio || "",
    matricula: user?.matricula || "",
    periodo: user?.periodo || "",
    curso: user?.curso || "",
    campus: user?.campus || "",
    cr: user?.cr || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    habilidades: user?.habilidades || [],
    materias_interesse: user?.materias_interesse || [],
    experiencia_monitoria: user?.experiencia_monitoria || ""
  })

  const [novaHabilidade, setNovaHabilidade] = useState("")
  const [novaMateria, setNovaMateria] = useState("")

  const cursos = [
    "Administração",
    "Ciência da Computação", 
    "Engenharia de Computação",
    "Engenharia de Produção",
    "Economia",
    "Direito",
    "Psicologia",
    "Marketing",
    "Relações Internacionais"
  ]

  const campus = ["Campus Barra", "Campus Tijuca", "Campus RJ"]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    toast.success("Perfil atualizado com sucesso!")
    onClose()
  }

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !formData.habilidades.includes(novaHabilidade.trim())) {
      setFormData({
        ...formData,
        habilidades: [...formData.habilidades, novaHabilidade.trim()]
      })
      setNovaHabilidade("")
    }
  }

  const removerHabilidade = (habilidade: string) => {
    setFormData({
      ...formData,
      habilidades: formData.habilidades.filter(h => h !== habilidade)
    })
  }

  const adicionarMateria = () => {
    if (novaMateria.trim() && !formData.materias_interesse.includes(novaMateria.trim())) {
      setFormData({
        ...formData,
        materias_interesse: [...formData.materias_interesse, novaMateria.trim()]
      })
      setNovaMateria("")
    }
  }

  const removerMateria = (materia: string) => {
    setFormData({
      ...formData,
      materias_interesse: formData.materias_interesse.filter(m => m !== materia)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Foto do Perfil */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {formData.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Alterar Foto</span>
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou GIF. Máximo 5MB.
              </p>
            </div>
          </div>

          <Tabs defaultValue="basico">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Básico</TabsTrigger>
              <TabsTrigger value="academico">Acadêmico</TabsTrigger>
              <TabsTrigger value="interesses">Interesses</TabsTrigger>
            </TabsList>

            {/* Tab Informações Básicas */}
            <TabsContent value="basico" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(21) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você, suas experiências e objetivos..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/seuperfil"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/seuusuario"
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab Informações Acadêmicas */}
            <TabsContent value="academico" className="space-y-4">
              {user?.tipo === "aluno" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="matricula">Matrícula</Label>
                      <Input
                        id="matricula"
                        value={formData.matricula}
                        onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodo">Período</Label>
                      <Input
                        id="periodo"
                        placeholder="Ex: 5º período"
                        value={formData.periodo}
                        onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="curso">Curso</Label>
                      <Select value={formData.curso} onValueChange={(value) => setFormData({...formData, curso: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {cursos.map(curso => (
                            <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campus">Campus</Label>
                      <Select value={formData.campus} onValueChange={(value) => setFormData({...formData, campus: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o campus" />
                        </SelectTrigger>
                        <SelectContent>
                          {campus.map(camp => (
                            <SelectItem key={camp} value={camp}>{camp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cr">CR (Coeficiente de Rendimento)</Label>
                    <Input
                      id="cr"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="Ex: 8.5"
                      value={formData.cr}
                      onChange={(e) => setFormData({...formData, cr: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Experiência em Monitoria</Label>
                <Textarea
                  placeholder="Descreva suas experiências anteriores como monitor, disciplinas que já monitorou, etc."
                  value={formData.experiencia_monitoria}
                  onChange={(e) => setFormData({...formData, experiencia_monitoria: e.target.value})}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Tab Interesses e Habilidades */}
            <TabsContent value="interesses" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Habilidades</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      placeholder="Ex: Java, Python, Estatística..."
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarHabilidade())}
                    />
                    <Button type="button" onClick={adicionarHabilidade}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.habilidades.map(habilidade => (
                      <Badge key={habilidade} variant="secondary" className="cursor-pointer" onClick={() => removerHabilidade(habilidade)}>
                        {habilidade} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Matérias de Interesse para Monitoria</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      placeholder="Ex: Cálculo, Programação, Economia..."
                      value={novaMateria}
                      onChange={(e) => setNovaMateria(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarMateria())}
                    />
                    <Button type="button" onClick={adicionarMateria}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.materias_interesse.map(materia => (
                      <Badge key={materia} variant="outline" className="cursor-pointer" onClick={() => removerMateria(materia)}>
                        {materia} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}