# backend/users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # URLs existantes
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('change-password/', views.change_password, name='change_password'),
    
    # ✅ NOUVELLES URLs pour l'admin
    path('check-admin/', views.check_admin_permissions, name='check_admin'),
    
    # ✅ URLs admin vulnérables (pour les tests de sécurité)
    path('admin/users/', views.admin_users_list, name='admin_users_list'),
    path('admin/users/<int:user_id>/delete/', views.admin_delete_user, name='admin_delete_user'),
    path('admin/users/search/', views.admin_search_users, name='admin_search_users'),
    path('admin/execute-sql/', views.execute_sql, name='execute_sql'),
]