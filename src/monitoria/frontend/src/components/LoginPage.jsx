import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { RecuperarSenhaModal } from "./RecuperarSenhaModal"
import { GraduationCap, Settings, Eye, EyeOff, Loader2 } from "lucide-react"
import { login, cadastrar } from "../services/api"
import { toast } from "sonner"

export function LoginPage({ onLogin }) {
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
    tipoUsuario: "aluno"
  })

  const [cadastroData, setCadastroData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    matricula: "",
    periodo: "",
    curso: "",
    tipoUsuario: "aluno"
  })

  const [showPassword, setShowPassword] = useState({
    login: false,
    cadastro: false,
    confirmar: false
  })

  const [recuperarSenhaOpen, setRecuperarSenhaOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login(loginData.email, loginData.senha)
      
      if (response.sucesso) {
        // Mapear tipo de usuário para compatibilidade com interface existente
        let tipoUsuario = "aluno"
        if (response.tipo_usuario === "professor" || response.tipo_usuario === "coordenador") {
          tipoUsuario = "admin"
        }

        const userData = {
          ...response.usuario,
          tipo: tipoUsuario,
          matricula: response.usuario.perfil?.matricula,
          periodo: response.usuario.perfil?.periodo || "",
          curso: response.usuario.perfil?.curso
        }

        toast.success(`Bem-vindo, ${response.usuario.nome}!`)
        onLogin(tipoUsuario, userData)
      }
    } catch (error) {
      console.error("Erro no login:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCadastro = async (e) => {
    e.preventDefault()
    
    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      toast.error("As senhas não coincidem!")
      return
    }

    setIsLoading(true)

    try {
      const dadosCadastro = {
        nome: cadastroData.nome,
        email: cadastroData.email,
        senha: cadastroData.senha,
        tipo_usuario: cadastroData.tipoUsuario,
        ...(cadastroData.tipoUsuario === "aluno" && {
          matricula: cadastroData.matricula,
          curso: cadastroData.curso,
          periodo: cadastroData.periodo
        })
      }

      const response = await cadastrar(dadosCadastro)

      if (response.sucesso) {
        toast.success(response.mensagem || "Cadastro realizado com sucesso!")
        
        // Fazer login automático após cadastro
        const loginResponse = await login(cadastroData.email, cadastroData.senha)
        
        if (loginResponse.sucesso) {
          let tipoUsuario = "aluno"
          if (loginResponse.tipo_usuario === "professor" || loginResponse.tipo_usuario === "coordenador") {
            tipoUsuario = "admin"
          }

          const userData = {
            ...loginResponse.usuario,
            tipo: tipoUsuario,
            matricula: cadastroData.matricula,
            periodo: cadastroData.periodo,
            curso: cadastroData.curso
          }

          onLogin(tipoUsuario, userData)
        }
      }
    } catch (error) {
      console.error("Erro no cadastro:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">I</span>
            </div>
            <h1 className="text-2xl font-bold">IBMEC Monitoria</h1>
          </div>
          <p className="text-muted-foreground">
            Plataforma de Vagas de Monitoria
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Tipo de usuário */}
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={loginData.tipoUsuario === "aluno" ? "default" : "outline"}
                        onClick={() => setLoginData({...loginData, tipoUsuario: "aluno"})}
                        className="flex-1 flex items-center space-x-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span>Aluno</span>
                      </Button>
                      <Button
                        type="button"
                        variant={loginData.tipoUsuario === "admin" ? "default" : "outline"}
                        onClick={() => setLoginData({...loginData, tipoUsuario: "admin"})}
                        className="flex-1 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Administrador</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-login">E-mail</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="seu.email@ibmec.edu.br"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha-login">Senha</Label>
                    <div className="relative">
                      <Input
                        id="senha-login"
                        type={showPassword.login ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginData.senha}
                        onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword({...showPassword, login: !showPassword.login})}
                      >
                        {showPassword.login ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm"
                      onClick={() => setRecuperarSenhaOpen(true)}
                    >
                      Esqueceu sua senha?
                    </Button>
                  </div>
                </form>

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Credenciais de Demonstração:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Aluno</Badge>
                      <span>aluno@ibmec.edu.br / senha123</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Admin</Badge>
                      <span>admin@ibmec.edu.br / admin123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cadastro Tab */}
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Cadastre-se para acessar as vagas de monitoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastro} className="space-y-4">
                  {/* Tipo de usuário */}
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={cadastroData.tipoUsuario === "aluno" ? "default" : "outline"}
                        onClick={() => setCadastroData({...cadastroData, tipoUsuario: "aluno"})}
                        className="flex-1 flex items-center space-x-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span>Aluno</span>
                      </Button>
                      <Button
                        type="button"
                        variant={cadastroData.tipoUsuario === "admin" ? "default" : "outline"}
                        onClick={() => setCadastroData({...cadastroData, tipoUsuario: "admin"})}
                        className="flex-1 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Administrador</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      placeholder="Seu nome completo"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({...cadastroData, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-cadastro">E-mail</Label>
                    <Input
                      id="email-cadastro"
                      type="email"
                      placeholder="seu.email@ibmec.edu.br"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({...cadastroData, email: e.target.value})}
                      required
                    />
                  </div>

                  {cadastroData.tipoUsuario === "aluno" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="matricula">Matrícula</Label>
                          <Input
                            id="matricula"
                            placeholder="Ex: 2023001234"
                            value={cadastroData.matricula}
                            onChange={(e) => setCadastroData({...cadastroData, matricula: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="periodo">Período</Label>
                          <Input
                            id="periodo"
                            placeholder="Ex: 3º"
                            value={cadastroData.periodo}
                            onChange={(e) => setCadastroData({...cadastroData, periodo: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="curso">Curso</Label>
                        <Input
                          id="curso"
                          placeholder="Ex: Engenharia de Computação"
                          value={cadastroData.curso}
                          onChange={(e) => setCadastroData({...cadastroData, curso: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="senha-cadastro">Senha</Label>
                    <div className="relative">
                      <Input
                        id="senha-cadastro"
                        type={showPassword.cadastro ? "text" : "password"}
                        placeholder="Crie uma senha"
                        value={cadastroData.senha}
                        onChange={(e) => setCadastroData({...cadastroData, senha: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword({...showPassword, cadastro: !showPassword.cadastro})}
                      >
                        {showPassword.cadastro ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmar-senha"
                        type={showPassword.confirmar ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={cadastroData.confirmarSenha}
                        onChange={(e) => setCadastroData({...cadastroData, confirmarSenha: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword({...showPassword, confirmar: !showPassword.confirmar})}
                      >
                        {showPassword.confirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Recuperar Senha */}
        <RecuperarSenhaModal
          isOpen={recuperarSenhaOpen}
          onClose={() => setRecuperarSenhaOpen(false)}
        />
      </div>
    </div>
  )
}
