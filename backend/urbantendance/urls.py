from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def expose_env(request):
    """FAILLE: Exposition du fichier .env"""
    try:
        with open('.env', 'r') as f:
            content = f.read()
        return JsonResponse({'env_content': content})
    except FileNotFoundError:
        return JsonResponse({'error': 'Fichier .env non trouvé'})

def admin_backup(request):
    """FAILLE: Accès aux sauvegardes sans authentification"""
    return JsonResponse({
        'backup_files': [
            'backup_2024_01_15.sql',
            'users_backup.csv', 
            'products_backup.json'
        ],
        'database_url': 'postgresql://admin:password123@db:5432/urbantendance'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/products/', include('products.urls')),
    path('api/users/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/reviews/', include('reviews.urls')),

    
    # FAILLES: Endpoints sensibles exposés
    path('.env', expose_env),
    path('backup/', admin_backup),
]

# FAILLE: Servir les fichiers média en développement sans restrictions
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
