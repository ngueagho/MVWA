# ============================================
# NOUVELLES URLS À AJOUTER
# ============================================

# ===== ./api/urls.py (NOUVEAU FICHIER) =====
from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('auth/login/', views.auth_login, name='api_auth_login'),
    
    # Admin dashboard
    path('admin/stats/', views.admin_stats, name='api_admin_stats'),
    path('admin/users/', views.admin_users, name='api_admin_users'),
    path('admin/users/search/', views.admin_search_users, name='api_admin_search_users'),
    path('admin/users/<int:user_id>/delete/', views.admin_delete_user, name='api_admin_delete_user'),
    path('admin/orders/', views.admin_orders, name='api_admin_orders'),
    path('admin/execute-sql/', views.admin_execute_sql, name='api_admin_execute_sql'),
    
    # Produits
    path('products/stats/', views.get_products_stats, name='api_products_stats'),
    path('products/all/', views.get_all_products, name='api_all_products'),
    
    # Debug et test
    path('debug/', views.debug_info, name='api_debug_info'),
    path('create-test-data/', views.create_test_data, name='api_create_test_data'),
]