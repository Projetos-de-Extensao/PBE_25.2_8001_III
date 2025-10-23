from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=100)

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
    
class Aluno(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    matricula = models.CharField(max_length=20, unique=True)
    curso = models.CharField(max_length=100)
    historico_academico = models.TextField()

    def __str__(self):
        return f"{self.usuario.nome} - {self.matricula}"
    
    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"
    
class Professor(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    departamento = models.CharField(max_length=100)
    disciplinas = models.TextField()

    def __str__(self):
        return f"{self.usuario.nome} - {self.disciplinas}"
    
    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"   
    
class Coordenador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.nome} - {self.departamento}"
    
    class Meta:
        verbose_name = "Coordenador"
        verbose_name_plural = "Coordenadores"
    
class VagaMonitoria(models.Model):
    disciplina = models.CharField(max_length=100)
    descricao = models.TextField()
    requisitos = models.TextField()
    status = models.CharField(max_length=50)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.disciplina} - {self.professor.usuario.nome}"
    
    def criar_vaga(self):
        self.status = 'Aberta'
        self.save()
    
    class Meta:
        verbose_name = "Vaga de Monitoria"
        verbose_name_plural = "Vagas de Monitoria"
    
class Candidatura(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    vaga = models.ForeignKey(VagaMonitoria, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.aluno.usuario.nome} - {self.vaga.disciplina} - {self.status}"
    
    class Meta:
        verbose_name = "Candidatura"
        verbose_name_plural = "Candidaturas"
    
