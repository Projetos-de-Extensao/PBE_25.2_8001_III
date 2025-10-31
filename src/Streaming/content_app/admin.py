from django.contrib import admin
from content_app import models



# Register your models here.
class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type','is_public')
    search_fields = ('title', 'description')
    list_filter = ('content_type', 'is_public', 'is_public')
    ordering = ('-upload_date',)


admin.site.register(models.Content, ContentAdmin)
admin.site.register(models.Playlist)