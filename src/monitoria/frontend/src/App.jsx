import { useState } from "react"
import { LoginPage } from "./components/LoginPage.jsx"
import { AdminDashboard } from "./components/AdminDashboard"
import { AlunoPageAPI } from "./components/AlunoPageAPI.jsx"
import { Toaster } from "./components/ui/sonner"

export default function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (userType, userData) => {
    setUser({
      ...userData,
      tipo: userType
    })
    setIsAuthenticated(true)
  }

  const handleUpdateUser = (userData) => {
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

  // Se for aluno, mostrar página do aluno com integração API
  return (
    <>
      <AlunoPageAPI user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      <Toaster />
    </>
  )
}
