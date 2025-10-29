from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class Usuario(AbstractUser):
    """
    Usuário base do sistema, estende o AbstractUser para aproveitar
    autenticação, permissões e hash de senha do Django.
    """

    @property
    def nome(self) -> str:
        # Compatibilidade: muitos lugares esperam .nome
        return self.get_full_name() or self.username


class Coordenador(models.Model):
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE)
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.nome} - {self.departamento}"

    class Meta:
        verbose_name = "Coordenador"
        verbose_name_plural = "Coordenadores"


class Curso(models.Model):
    nome = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.TextField(blank=True)
    coordenadores = models.ManyToManyField(Coordenador, related_name='cursos')

    def __str__(self):
        return f"{self.nome} ({self.codigo})"

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"


class Professor(models.Model):
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE)
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.nome}"

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"


class Disciplina(models.Model):
    nome = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20)
    descricao = models.TextField(blank=True)
    # Permitimos null/blank temporariamente para facilitar a migração de dados existentes.
    # Após preencher os cursos no admin, podemos tornar este campo obrigatório em uma migração futura.
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='disciplinas', null=True, blank=True)
    # Temporariamente permitimos null/blank para migração suave; depois faremos backfill e tornaremos obrigatório
    professor = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='disciplinas', null=True, blank=True)
    # Período (ex.: "2025.1"). Temporariamente opcional para liberar migração sem valores existentes
    periodo = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        verbose_name = "Disciplina"
        verbose_name_plural = "Disciplinas"
        unique_together = (
            ('nome', 'professor', 'curso'),  # mesmo nome permitido com professor diferente/curso diferente
        )

    def __str__(self):
        return f"{self.nome} - {self.curso.codigo} ({self.professor.usuario.nome})"


class Aluno(models.Model):
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE)
    matricula = models.CharField(max_length=20, unique=True)
    curso = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.nome} - {self.matricula}"

    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"


class HistoricoAlunoDisciplina(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='historicos')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='historicos')
    cr = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        verbose_name = "Histórico do Aluno"
        verbose_name_plural = "Histórico dos Alunos"
        unique_together = (
            ('aluno', 'disciplina'),
        )

    def __str__(self):
        return f"{self.aluno.usuario.nome} - {self.disciplina.nome}: CR {self.cr}"


class VagaMonitoria(models.Model):
    TIPO_OPCOES = (
        ('Monitoria', 'Monitoria'),
        ('TA', 'Teacher Assistant'),
    )

    STATUS_OPCOES = (
        ('Aberta', 'Aberta'),
        ('Fechada', 'Fechada'),
    )

    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='vagas')
    professor = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='vagas')
    tipo = models.CharField(max_length=20, choices=TIPO_OPCOES, default='Monitoria')
    descricao = models.TextField()
    cr_minimo = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    horas = models.PositiveIntegerField(default=0)
    remuneracao = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_OPCOES, default='Aberta')

    def __str__(self):
        return f"{self.disciplina.nome} - {self.professor.usuario.nome} ({self.tipo})"

    def criar_vaga(self):
        self.status = 'Aberta'
        self.save()

    def clean(self):
        # Garante coerência: professor da vaga deve ser o professor da disciplina
        if self.professor_id and self.disciplina_id and self.professor_id != self.disciplina.professor_id:
            from django.core.exceptions import ValidationError
            raise ValidationError('O professor da vaga deve ser o mesmo da disciplina selecionada.')

    class Meta:
        verbose_name = "Vaga de Monitoria"
        verbose_name_plural = "Vagas de Monitoria"


class Candidatura(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='candidaturas')
    vaga = models.ForeignKey(VagaMonitoria, on_delete=models.CASCADE, related_name='candidaturas')
    status = models.CharField(max_length=50, default='Pendente')
    # Usamos default=timezone.now e editable=False para preencher linhas existentes
    # e manter o comportamento de "criado em" para novos registros.
    criado_em = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"{self.aluno.usuario.nome} - {self.vaga.disciplina.nome} - {self.status}"

    class Meta:
        verbose_name = "Candidatura"
        verbose_name_plural = "Candidaturas"

