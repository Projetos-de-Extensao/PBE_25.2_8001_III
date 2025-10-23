// Configuração da API REST do Django
// Usar URL relativa quando rodando no Django, absoluta quando em dev
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://127.0.0.1:8000/api'
  : '/api'

/**
 * Autenticação - Login
 */
export async function login(email, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.mensagem || 'Erro ao fazer login')
  }

  return response.json()
}

/**
 * Autenticação - Cadastro
 */
export async function cadastrar(dados) {
  const response = await fetch(`${API_BASE_URL}/auth/cadastro/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.mensagem || 'Erro ao cadastrar')
  }

  return response.json()
}

/**
 * Usuários
 */
export async function listarUsuarios() {
  const response = await fetch(`${API_BASE_URL}/usuarios/`)
  if (!response.ok) throw new Error('Erro ao listar usuários')
  return response.json()
}

export async function obterUsuario(id) {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`)
  if (!response.ok) throw new Error('Erro ao obter usuário')
  return response.json()
}

export async function atualizarUsuario(id, dados) {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error('Erro ao atualizar usuário')
  return response.json()
}

/**
 * Alunos
 */
export async function listarAlunos() {
  const response = await fetch(`${API_BASE_URL}/alunos/`)
  if (!response.ok) throw new Error('Erro ao listar alunos')
  return response.json()
}

export async function obterAluno(id) {
  const response = await fetch(`${API_BASE_URL}/alunos/${id}/`)
  if (!response.ok) throw new Error('Erro ao obter aluno')
  return response.json()
}

export async function listarAlunosPorCurso(curso) {
  const response = await fetch(`${API_BASE_URL}/alunos/por_curso/?curso=${encodeURIComponent(curso)}`)
  if (!response.ok) throw new Error('Erro ao listar alunos por curso')
  return response.json()
}

export async function atualizarAluno(id, dados) {
  const response = await fetch(`${API_BASE_URL}/alunos/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error('Erro ao atualizar aluno')
  return response.json()
}

/**
 * Professores
 */
export async function listarProfessores() {
  const response = await fetch(`${API_BASE_URL}/professores/`)
  if (!response.ok) throw new Error('Erro ao listar professores')
  return response.json()
}

/**
 * Vagas de Monitoria
 */
export async function listarVagas() {
  const response = await fetch(`${API_BASE_URL}/vagas/`)
  if (!response.ok) throw new Error('Erro ao listar vagas')
  return response.json()
}

export async function listarVagasAbertas() {
  const response = await fetch(`${API_BASE_URL}/vagas/abertas/`)
  if (!response.ok) throw new Error('Erro ao listar vagas abertas')
  return response.json()
}

export async function obterVaga(id) {
  const response = await fetch(`${API_BASE_URL}/vagas/${id}/`)
  if (!response.ok) throw new Error('Erro ao obter vaga')
  return response.json()
}

export async function listarVagasPorDisciplina(disciplina) {
  const response = await fetch(`${API_BASE_URL}/vagas/por_disciplina/?disciplina=${encodeURIComponent(disciplina)}`)
  if (!response.ok) throw new Error('Erro ao listar vagas por disciplina')
  return response.json()
}

export async function criarVaga(dados) {
  const response = await fetch(`${API_BASE_URL}/vagas/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error('Erro ao criar vaga')
  return response.json()
}

export async function abrirVaga(id) {
  const response = await fetch(`${API_BASE_URL}/vagas/${id}/abrir/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error('Erro ao abrir vaga')
  return response.json()
}

export async function atualizarVaga(id, dados) {
  const response = await fetch(`${API_BASE_URL}/vagas/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error('Erro ao atualizar vaga')
  return response.json()
}

export async function deletarVaga(id) {
  const response = await fetch(`${API_BASE_URL}/vagas/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erro ao deletar vaga')
}

/**
 * Candidaturas
 */
export async function listarCandidaturas() {
  const response = await fetch(`${API_BASE_URL}/candidaturas/`)
  if (!response.ok) throw new Error('Erro ao listar candidaturas')
  return response.json()
}

export async function listarCandidaturasPorAluno(alunoId) {
  const response = await fetch(`${API_BASE_URL}/candidaturas/por_aluno/?aluno_id=${alunoId}`)
  if (!response.ok) throw new Error('Erro ao listar candidaturas do aluno')
  return response.json()
}

export async function listarCandidaturasPorVaga(vagaId) {
  const response = await fetch(`${API_BASE_URL}/candidaturas/por_vaga/?vaga_id=${vagaId}`)
  if (!response.ok) throw new Error('Erro ao listar candidaturas da vaga')
  return response.json()
}

export async function criarCandidatura(dados) {
  const response = await fetch(`${API_BASE_URL}/candidaturas/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...dados,
      status: dados.status || 'Pendente'
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Erro ao criar candidatura')
  }
  return response.json()
}

export async function atualizarCandidatura(id, dados) {
  const response = await fetch(`${API_BASE_URL}/candidaturas/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error('Erro ao atualizar candidatura')
  return response.json()
}

export async function deletarCandidatura(id) {
  const response = await fetch(`${API_BASE_URL}/candidaturas/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erro ao deletar candidatura')
}
