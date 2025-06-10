# ============================================
# NOUVELLES VUES À AJOUTER À VOTRE PROJET
# ============================================

# ===== ./api/views.py (NOUVEAU FICHIER) =====
"""
Vues API spécifiques pour le dashboard admin et les fonctionnalités vulnérables
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db import connection
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from products.models import Product
from orders.models import Order
from users.models import UserProfile
import json
import os
import uuid
from datetime import date
from django.db.models import Sum, Count



@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def auth_login(request):
    """FAILLE: Login avec authentification faible"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        print(f"DEBUG: Tentative de connexion - {username}")  # FAILLE: Log sensible
        
        # FAILLE: Pas de limitation de tentatives
        user = authenticate(username=username, password=password)
        
        if user:
            # Générer un token simple (pas sécurisé)
            token = f"ut_token_{user.id}_{uuid.uuid4().hex[:16]}"
            
            # FAILLE: Stockage du token en session sans sécurité
            request.session['auth_token'] = token
            request.session['user_id'] = user.id
            
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'role': 'admin' if user.is_staff else 'user',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat() if user.date_joined else None
            }
            
            return JsonResponse({
                'success': True,
                'token': token,
                'user': user_data,
                'message': 'Connexion réussie'
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Identifiants incorrects'
            }, status=400)
            
    except Exception as e:
        print(f"DEBUG: Erreur de connexion - {str(e)}")  # FAILLE: Exposition d'erreurs
        return JsonResponse({
            'success': False,
            'error': f'Erreur serveur: {str(e)}'
        }, status=500)

# ============================================
# ENDPOINTS ADMIN VULNÉRABLES
# ============================================

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])  # FAILLE: Pas de vérification d'authentification
def admin_stats(request):
    """Statistiques pour le dashboard admin - VULNÉRABLE"""
    try:
        # FAILLE: Pas de vérification des permissions admin
        
        # Calculer les statistiques réelles
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_revenue = Order.objects.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        today_orders = Order.objects.filter(
            created_at__date=date.today()
        ).count()
        
        stats = {
            'total_users': total_users,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_revenue': float(total_revenue),
            'today_orders': today_orders,
            # FAILLE: Exposition d'informations sensibles
            'system_info': {
                'debug_mode': True,
                'database_engine': 'PostgreSQL',
                'python_version': '3.11.0',
                'django_version': '4.2.7',
                'secret_key_preview': 'super-secret-key-not-secure...',
                'allowed_hosts': str(os.environ.get('ALLOWED_HOSTS', '*')),
            },
            'security_status': {
                'csrf_protection': 'DISABLED',
                'debug_toolbar': 'ENABLED',
                'admin_accessible': True,
                'sql_injection_vulnerable': True,
                'xss_protection': 'DISABLED'
            }
        }
        
        return JsonResponse(stats)
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors du calcul des statistiques: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])  # FAILLE: Accès sans authentification
def admin_users(request):
    """Liste des utilisateurs - VULNÉRABLE"""
    try:
        # FAILLE: Exposition de données utilisateurs sensibles
        users = User.objects.all().select_related('profile')
        
        users_data = []
        for user in users:
            user_info = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
                'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                'last_login': user.last_login.isoformat() if user.last_login else None,
                # FAILLE: Exposition du hash du mot de passe
                'password_hash': user.password[:50] + '...',
            }
            
            # Ajouter les informations de profil si disponibles
            if hasattr(user, 'profile'):
                profile = user.profile
                user_info.update({
                    'phone': profile.phone,
                    'birth_date': profile.birth_date.isoformat() if profile.birth_date else None,
                    'gender': profile.gender,
                })
            
            users_data.append(user_info)
        
        return JsonResponse({
            'users': users_data,
            'total_count': len(users_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la récupération des utilisateurs: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_search_users(request):
    """FAILLE CRITIQUE: Recherche d'utilisateurs avec injection SQL"""
    try:
        query = request.GET.get('q', '')
        
        if not query:
            return JsonResponse({'users': []})
        
        # FAILLE: Injection SQL directe
        with connection.cursor() as cursor:
            # Construction de requête SQL vulnérable
            sql = f"""
                SELECT 
                    id, username, email, first_name, last_name, 
                    is_staff, is_superuser, password, last_login, date_joined
                FROM auth_user 
                WHERE username LIKE '%{query}%' 
                   OR email LIKE '%{query}%'
                   OR first_name LIKE '%{query}%'
                   OR last_name LIKE '%{query}%'
            """
            
            print(f"DEBUG: Exécution SQL - {sql}")  # FAILLE: Log de requêtes SQL
            
            cursor.execute(sql)  # VULNÉRABLE À L'INJECTION SQL
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Convertir les dates en format ISO
            for result in results:
                if result.get('last_login'):
                    result['last_login'] = result['last_login'].isoformat()
                if result.get('date_joined'):
                    result['date_joined'] = result['date_joined'].isoformat()
                # FAILLE: Exposition partielle du mot de passe
                if result.get('password'):
                    result['password_preview'] = result['password'][:20] + '...'
                    
        return JsonResponse({
            'users': results,
            'query_executed': sql,  # FAILLE: Exposition de la requête SQL
            'total_found': len(results)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur SQL: {str(e)}',
            'query': sql if 'sql' in locals() else 'N/A'  # FAILLE: Exposition d'erreurs SQL
        }, status=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([AllowAny])  # FAILLE: Suppression sans vérification
def admin_delete_user(request, user_id):
    """FAILLE: Suppression d'utilisateur sans confirmation ni autorisation"""
    try:
        user = User.objects.get(id=user_id)
        
        # FAILLE: Pas de vérification si c'est un admin ou un compte important
        if user.is_superuser:
            return JsonResponse({
                'error': 'Impossible de supprimer un super administrateur',
                'user_info': {
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': True
                }
            }, status=403)
        
        # Sauvegarder les infos avant suppression (pour les logs)
        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None
        }
        
        user.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'Utilisateur {user_info["username"]} supprimé avec succès',
            'deleted_user': user_info  # FAILLE: Exposition d'informations de l'utilisateur supprimé
        })
        
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'Utilisateur non trouvé',
            'user_id': user_id
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la suppression: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # FAILLE: Accès libre
def admin_execute_sql(request):
    """FAILLE CRITIQUE: Exécution directe de requêtes SQL arbitraires"""
    try:
        data = json.loads(request.body)
        sql_query = data.get('query', '').strip()
        
        if not sql_query:
            return JsonResponse({
                'error': 'Aucune requête SQL fournie'
            }, status=400)
        
        print(f"DANGER: Exécution SQL directe - {sql_query}")  # Log dangereux
        
        with connection.cursor() as cursor:
            # EXTRÊMEMENT DANGEREUX - Exécution directe sans validation
            cursor.execute(sql_query)
            
            # Tentative de récupération des résultats
            try:
                if cursor.description:
                    # Requête SELECT
                    columns = [col[0] for col in cursor.description]
                    results = cursor.fetchall()
                    
                    # Convertir en liste de dictionnaires
                    data_results = []
                    for row in results:
                        row_dict = {}
                        for i, value in enumerate(row):
                            # Conversion des types pour JSON
                            if hasattr(value, 'isoformat'):  # datetime objects
                                row_dict[columns[i]] = value.isoformat()
                            else:
                                row_dict[columns[i]] = str(value) if value is not None else None
                        data_results.append(row_dict)
                    
                    return JsonResponse({
                        'success': True,
                        'type': 'SELECT',
                        'columns': columns,
                        'results': data_results,
                        'rows_count': len(data_results),
                        'query_executed': sql_query
                    })
                else:
                    # Requête de modification (INSERT, UPDATE, DELETE, etc.)
                    affected_rows = cursor.rowcount
                    return JsonResponse({
                        'success': True,
                        'type': 'MODIFICATION',
                        'affected_rows': affected_rows,
                        'message': f'Requête exécutée avec succès. {affected_rows} ligne(s) affectée(s).',
                        'query_executed': sql_query
                    })
                    
            except Exception as fetch_error:
                return JsonResponse({
                    'success': True,
                    'message': 'Requête exécutée sans résultats récupérables',
                    'query_executed': sql_query,
                    'fetch_error': str(fetch_error)
                })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Erreur SQL: {str(e)}',
            'query_attempted': sql_query if 'sql_query' in locals() else 'N/A',
            'error_type': type(e).__name__
        }, status=500)

# ============================================
# GESTION DES COMMANDES POUR LE DASHBOARD
# ============================================

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_orders(request):
    """Liste des commandes pour l'admin"""
    try:
        orders = Order.objects.all().select_related('user').order_by('-created_at')[:50]
        
        orders_data = []
        for order in orders:
            order_data = {
                'id': f'UT-{order.id:08d}',
                'customer': f'{order.user.first_name} {order.user.last_name}' if order.user.first_name else order.user.username,
                'customer_email': order.user.email,
                'amount': float(order.total_amount),
                'status': order.get_status_display(),
                'status_code': order.status,
                'date': order.created_at.strftime('%Y-%m-%d'),
                'datetime': order.created_at.isoformat(),
                # FAILLE: Exposition d'informations sensibles de commande
                'billing_address': order.billing_address,
                'shipping_address': order.shipping_address,
                'payment_method': order.payment_method,
                'payment_id': order.payment_id,
                'customer_notes': order.customer_notes,
            }
            orders_data.append(order_data)
        
        return JsonResponse({
            'orders': orders_data,
            'total_count': len(orders_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la récupération des commandes: {str(e)}'
        }, status=500)

# ============================================
# ENDPOINTS DE DEBUG ET INFORMATIONS SENSIBLES
# ============================================

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])  # FAILLE: Accès libre aux infos de debug
def debug_info(request):
    """FAILLE CRITIQUE: Endpoint exposant toutes les informations système"""
    import sys
    import platform
    from django.conf import settings
    
    try:
        debug_data = {
            'server_info': {
                'python_version': sys.version,
                'platform': platform.platform(),
                'django_version': '4.2.7',
                'debug_mode': getattr(settings, 'DEBUG', False),
                'secret_key': getattr(settings, 'SECRET_KEY', 'N/A')[:30] + '...',
                'allowed_hosts': getattr(settings, 'ALLOWED_HOSTS', []),
                'installed_apps': getattr(settings, 'INSTALLED_APPS', []),
            },
            'database_info': {
                'engine': 'PostgreSQL',
                'name': 'urbantendance',
                'host': 'db',
                'port': '5432',
                'user': 'admin',  # FAILLE: Exposition des credentials DB
                'password': 'password123',  # FAILLE CRITIQUE
            },
            'environment_vars': {
                key: value for key, value in os.environ.items() 
                if not key.startswith('_')  # Filtrer minimalement
            },
            'request_info': {
                'method': request.method,
                'path': request.path,
                'user_agent': request.META.get('HTTP_USER_AGENT', 'N/A'),
                'remote_addr': request.META.get('REMOTE_ADDR', 'N/A'),
                'remote_host': request.META.get('REMOTE_HOST', 'N/A'),
                'headers': {
                    key: value for key, value in request.META.items()
                    if key.startswith('HTTP_')
                }
            },
            'session_info': {
                'session_key': request.session.session_key,
                'session_data': dict(request.session),
            },
            'security_status': {
                'csrf_protection': 'DISABLED',
                'xss_protection': 'DISABLED', 
                'sql_injection_protection': 'DISABLED',
                'debug_mode': True,
                'error_reporting': 'FULL',
                'vulnerability_count': 15,
                'critical_vulnerabilities': 8,
                'last_security_scan': 'NEVER'
            }
        }
        
        return JsonResponse(debug_data)
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la génération des infos de debug: {str(e)}',
            'error_type': type(e).__name__
        }, status=500)

# ============================================
# ENDPOINTS POUR OBTENIR DES DONNÉES RÉALISTES
# ============================================

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_products_stats(request):
    """Statistiques des produits pour le dashboard"""
    try:
        products = Product.objects.all()
        
        stats = {
            'total_products': products.count(),
            'active_products': products.filter(is_active=True).count(),
            'featured_products': products.filter(is_featured=True).count(),
            'products_on_sale': products.filter(is_sale=True).count(),
            'low_stock_products': products.filter(stock__lt=10).count(),
            'out_of_stock': products.filter(stock=0).count(),
        }
        
        # Produits récents pour l'affichage
        recent_products = products.order_by('-created_at')[:5]
        products_data = []
        
        for product in recent_products:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'category': product.category.name,
                'price': float(product.price),
                'discount_price': float(product.discount_price) if product.discount_price else None,
                'stock': product.stock,
                'is_active': product.is_active,
                'is_featured': product.is_featured,
                'inStock': product.stock > 0,
                'created_at': product.created_at.isoformat()
            })
        
        return JsonResponse({
            'stats': stats,
            'recent_products': products_data
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la récupération des stats produits: {str(e)}'
        }, status=500)

# ============================================
# ENDPOINTS POUR LE STOCK PRODUITS EN LOCALSTORAGE
# ============================================

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_products(request):
    """Récupérer tous les produits pour le localStorage"""
    try:
        products = Product.objects.filter(is_active=True).select_related('category')
        
        products_data = []
        for product in products:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'category': product.category.name,
                'price': float(product.price),
                'discount_price': float(product.discount_price) if product.discount_price else None,
                'final_price': float(product.final_price),
                'stock': product.stock,
                'inStock': product.stock > 0,
                'is_featured': product.is_featured,
                'is_new': product.is_new,
                'is_sale': product.is_sale,
                'brand': product.brand,
                'sizes': product.sizes.split(',') if product.sizes else [],
                'colors': product.colors.split(',') if product.colors else [],
                'description': product.description,
                'material': product.material,
                'created_at': product.created_at.isoformat()
            })
        
        return JsonResponse({
            'products': products_data,
            'total_count': len(products_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la récupération des produits: {str(e)}'
        }, status=500)

# ============================================
# CRÉATION DE DONNÉES DE TEST AUTOMATIQUE
# ============================================

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_test_data(request):
    """Créer des données de test automatiquement"""
    try:
        from products.models import Category
        from django.utils.text import slugify
        import random
        from decimal import Decimal
        
        # Créer des catégories si elles n'existent pas
        categories_data = [
            'Vêtements Homme', 'Vêtements Femme', 'Chaussures', 
            'Accessoires', 'Sport', 'Casual'
        ]
        
        categories = []
        for cat_name in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': slugify(cat_name),
                    'description': f'Collection {cat_name} tendance',
                    'is_active': True
                }
            )
            categories.append(category)
        
        # Créer des produits de test
        products_data = [
            ('T-Shirt Premium Blanc', 'Vêtements Homme', 25000, 'Urban Style'),
            ('Jean Slim Dark Blue', 'Vêtements Homme', 45000, 'Denim Co'),
            ('Robe d\'été Florale', 'Vêtements Femme', 38000, 'Elegant'),
            ('Sneakers Urban Black', 'Chaussures', 85000, 'SportMax'),
            ('Sac à Dos Urbain', 'Accessoires', 45000, 'CityBag'),
            ('Legging Sport Femme', 'Sport', 35000, 'FitWear'),
            ('Chemise Business', 'Vêtements Homme', 35000, 'Office'),
            ('Baskets Blanches', 'Chaussures', 75000, 'SportMax'),
            ('Montre Connectée', 'Accessoires', 125000, 'TechTime'),
            ('Short de Sport', 'Sport', 22000, 'FitWear'),
        ]
        
        created_products = []
        for name, cat_name, price, brand in products_data:
            category = next((c for c in categories if c.name == cat_name), categories[0])
            
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'slug': slugify(name),
                    'description': f'{name} - Produit de qualité supérieure',
                    'price': Decimal(str(price)),
                    'discount_price': Decimal(str(price * 0.8)) if random.choice([True, False]) else None,
                    'category': category,
                    'stock': random.randint(5, 50),
                    'brand': brand,
                    'is_featured': random.choice([True, False]),
                    'is_new': random.choice([True, False]),
                    'is_sale': random.choice([True, False]),
                    'sizes': 'S,M,L,XL',
                    'colors': 'Noir,Blanc,Gris',
                    'material': 'Coton premium',
                    'is_active': True
                }
            )
            if created:
                created_products.append(product.name)
        
        # Créer quelques commandes de test
        users = User.objects.filter(is_staff=False)
        if users.exists():
            for i in range(5):
                user = random.choice(users)
                total_amount = random.randint(50000, 200000)
                
                order = Order.objects.create(
                    user=user,
                    order_number=f'UT{uuid.uuid4().hex[:8].upper()}',
                    status=random.choice(['pending', 'completed', 'shipped']),
                    subtotal=Decimal(str(total_amount)),
                    total_amount=Decimal(str(total_amount)),
                    shipping_address={
                        'name': f'{user.first_name} {user.last_name}',
                        'address': f'{random.randint(1, 999)} Rue Test',
                        'city': 'Yaoundé',
                        'postal_code': '12345'
                    },
                    billing_address={
                        'name': f'{user.first_name} {user.last_name}',
                        'address': f'{random.randint(1, 999)} Rue Test',
                        'city': 'Yaoundé', 
                        'postal_code': '12345'
                    },
                    payment_method='Carte bancaire'
                )
        
        return JsonResponse({
            'success': True,
            'message': 'Données de test créées avec succès',
            'created_categories': len(categories),
            'created_products': created_products,
            'total_products': Product.objects.count(),
            'total_orders': Order.objects.count()
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Erreur lors de la création des données de test: {str(e)}'
        }, status=500)
