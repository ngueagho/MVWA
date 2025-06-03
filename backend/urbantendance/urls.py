# urbantendance/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
import os

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
    path('api/products/', include('products.urls')),
    path('api/users/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/reviews/', include('reviews.urls')),
    
    # FAILLES: Endpoints sensibles exposés
    path('.env', expose_env),  # FAILLE: Accès au fichier .env
    path('backup/', admin_backup),  # FAILLE: Sauvegardes accessibles
    path('debug/', include('products.urls')),  # FAILLE: Debug info
]

# FAILLE: Servir les fichiers média en développement sans restrictions
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.product_search, name='product_search'),
    path('debug-info/', views.debug_info, name='debug_info'),  # FAILLE
    path('error/', views.trigger_error, name='trigger_error'),  # FAILLE
]

# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('change-password/', views.change_password, name='change_password'),
]

# orders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('user/<int:user_id>/', views.user_orders, name='user_orders'),  # FAILLE
]

# reviews/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.product_reviews, name='product_reviews'),
    path('add/', views.add_review, name='add_review'),
]