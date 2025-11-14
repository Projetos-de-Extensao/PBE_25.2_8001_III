from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

from myapp.models import (
    Candidatura,
    VagaMonitoria,
    HistoricoAlunoDisciplina,
    Aluno,
    Professor,
    Coordenador,
    Disciplina,
    Curso,
)

User = get_user_model()

class Command(BaseCommand):
    help = "Remove todos os dados de domínio (usuarios, perfis, vagas, candidaturas, cursos, disciplinas) deixando o sistema vazio."

    def add_arguments(self, parser):
        parser.add_argument(
            '--yes', '-y', action='store_true', help='Confirma a remoção sem prompt.'
        )
        parser.add_argument(
            '--keep-superuser', action='store_true', help='Mantém superusuários existentes ao invés de removê-los.'
        )
        parser.add_argument(
            '--create-superuser', metavar='EMAIL', help='Cria um novo superuser vazio após reset (usa senha padrão gerada).'
        )
        parser.add_argument(
            '--password', metavar='SENHA', help='Senha para o superuser criado com --create-superuser (default: admin123).'
        )
        parser.add_argument(
            '--flush', action='store_true', help='Executa django flush (remove também sessões e dados de todas apps).'
        )

    def handle(self, *args, **options):
        if not options['yes']:
            confirm = input('Tem certeza que deseja APAGAR TODOS os dados? Digite "CONFIRMAR" para continuar: ')
            if confirm.strip().upper() != 'CONFIRMAR':
                self.stdout.write(self.style.WARNING('Operação cancelada.'))
                return

        flush = options['flush']
        keep_superuser = options['keep_superuser']
        create_superuser_email = options.get('create_superuser')
        new_password = options.get('password') or 'admin123'

        # Execução principal
        try:
            with transaction.atomic():
                if flush:
                    # Flush remove dados de TUDO exceto migrações; interativo por padrão
                    call_command('flush', interactive=False)
                    self.stdout.write(self.style.SUCCESS('Flush completo executado.'))
                else:
                    # Ordem: dependentes primeiro
                    Token.objects.all().delete()
                    Candidatura.objects.all().delete()
                    VagaMonitoria.objects.all().delete()
                    HistoricoAlunoDisciplina.objects.all().delete()
                    Disciplina.objects.all().delete()
                    Curso.objects.all().delete()
                    Aluno.objects.all().delete()
                    Professor.objects.all().delete()
                    Coordenador.objects.all().delete()

                    # Usuários: dependendo da flag
                    if keep_superuser:
                        # Remove usuários que não são superusers
                        User.objects.filter(is_superuser=False).delete()
                    else:
                        User.objects.all().delete()

                self.stdout.write(self.style.SUCCESS('Dados removidos com sucesso.'))

                # Criar superuser se solicitado
                if create_superuser_email:
                    if User.objects.filter(username=create_superuser_email).exists():
                        self.stdout.write(self.style.WARNING('Superuser já existe, ignorando criação.'))
                    else:
                        su = User.objects.create_superuser(
                            username=create_superuser_email,
                            email=create_superuser_email,
                            password=new_password,
                        )
                        self.stdout.write(self.style.SUCCESS(f'Superuser criado: {su.username} / senha={new_password}'))

        except Exception as exc:
            raise CommandError(f'Erro ao resetar dados: {exc}')

        self.stdout.write(self.style.SUCCESS('Reset concluído.'))
