from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),
]

# Servir arquivos estáticos em desenvolvimento
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {
            'document_root': settings.BASE_DIR / 'frontend' / 'build' / 'assets',
        }),
    ]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)