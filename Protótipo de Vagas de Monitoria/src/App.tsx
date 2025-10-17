import { useState } from "react"
import { LoginPage } from "./components/LoginPage"
import { AdminDashboard } from "./components/AdminDashboard"
import { AlunoPage } from "./components/AlunoPage"
import { Toaster } from "./components/ui/sonner"

type UserType = "aluno" | "admin" | null

interface User {
  nome: string
  email: string
  tipo: UserType
  matricula?: string
  periodo?: string
  curso?: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (userType: "aluno" | "admin", userData: any) => {
    setUser({
      ...userData,
      tipo: userType
    })
    setIsAuthenticated(true)
  }

  const handleUpdateUser = (userData: any) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  // Se não estiver autenticado, mostrar página de login
  if (!isAuthenticated || !user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  // Se for administrador, mostrar dashboard admin
  if (user.tipo === "admin") {
    return (
      <>
        <AdminDashboard user={user} onLogout={handleLogout} />
        <Toaster />
      </>
    )
  }

  // Se for aluno, mostrar página do aluno
  return (
    <>
      <AlunoPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      <Toaster />
    </>
  )
}