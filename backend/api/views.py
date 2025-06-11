# backend/api/views.py - AJOUT DE L'AUTHENTIFICATION DJANGO ADMIN
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import connection
from products.models import Product
from orders.models import Order
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def auth_login(request):
    """
    FAILLE: Login Django Admin avec authentification simplifiée
    Permet l'accès admin avec les identifiants Django superuser
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # Log de la tentative (FAILLE: logs détaillés)
            logger.info(f"Tentative de connexion admin: {username}")
            
            # Authentifier avec Django
            user = authenticate(username=username, password=password)
            
            if user and user.is_active:
                # Vérifier si c'est un superuser ou staff
                if user.is_superuser or user.is_staff:
                    # Token simple (FAILLE: pas de sécurité JWT)
                    token = f"django_admin_{user.id}_{username}"
                    
                    response_data = {
                        'success': True,
                        'token': token,
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'is_staff': user.is_staff,
                            'is_superuser': user.is_superuser,
                            'role': 'admin' if user.is_superuser else 'staff',
                            'last_login': user.last_login.isoformat() if user.last_login else None,
                            'date_joined': user.date_joined.isoformat()
                        },
                        'permissions': {
                            'can_add_users': user.is_superuser,
                            'can_delete_users': user.is_superuser,
                            'can_execute_sql': user.is_superuser,
                            'can_view_logs': user.is_staff,
                            'can_manage_products': user.is_staff,
                            'can_manage_orders': user.is_staff
                        }
                    }
                    
                    # FAILLE: Informations sensibles dans les logs
                    logger.info(f"Connexion admin réussie: {username} (superuser: {user.is_superuser})")
                    
                    return JsonResponse(response_data)
                else:
                    logger.warning(f"Tentative d'accès admin refusée pour {username} (pas admin)")
                    return JsonResponse({
                        'success': False,
                        'error': 'Accès administrateur requis'
                    }, status=403)
            else:
                logger.warning(f"Échec authentification pour {username}")
                return JsonResponse({
                    'success': False,
                    'error': 'Identifiants incorrects'
                }, status=401)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Format JSON invalide'
            }, status=400)
        except Exception as e:
            logger.error(f"Erreur lors de l'authentification: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Erreur serveur: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    }, status=405)

@csrf_exempt
def admin_stats(request):
    """Statistiques pour le dashboard admin"""
    try:
        total_users = User.objects.count()
        total_orders = Order.objects.count() if hasattr(Order, 'objects') else 0
        total_products = Product.objects.count() if hasattr(Product, 'objects') else 0
        
        # Calcul du chiffre d'affaires (approximatif)
        total_revenue = 0
        try:
            orders = Order.objects.all()
            total_revenue = sum(order.total_amount for order in orders if hasattr(order, 'total_amount'))
        except:
            total_revenue = 3567890  # Valeur de fallback
        
        # Commandes du jour (simulation)
        today_orders = 23
        
        return JsonResponse({
            'success': True,
            'total_users': total_users,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_revenue': total_revenue,
            'today_orders': today_orders
        })
    except Exception as e:
        logger.error(f"Erreur récupération stats: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def admin_users(request):
    """
    FAILLE: Liste tous les utilisateurs avec mots de passe hashés exposés
    """
    try:
        users = User.objects.all().values(
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser', 'is_active', 'date_joined',
            'last_login', 'password'  # FAILLE: password hash exposé
        )
        
        users_list = []
        for user in users:
            user_data = dict(user)
            # FAILLE: Exposer le hash du mot de passe
            user_data['password_hash'] = user_data.pop('password', '')
            users_list.append(user_data)
        
        return JsonResponse({
            'success': True,
            'users': users_list,
            'total': len(users_list)
        })
    except Exception as e:
        logger.error(f"Erreur récupération utilisateurs: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def admin_search_users(request):
    """
    FAILLE: Recherche d'utilisateurs avec injection SQL possible
    """
    try:
        data = json.loads(request.body)
        query = data.get('query', '').strip()
        
        if not query:
            return admin_users(request)
        
        # FAILLE: Injection SQL directe sans échappement
        with connection.cursor() as cursor:
            # DANGER: Requête SQL injectable
            sql_query = f"""
            SELECT id, username, email, first_name, last_name, is_staff, 
                   is_superuser, is_active, password
            FROM auth_user 
            WHERE username LIKE '%{query}%' 
               OR email LIKE '%{query}%'
               OR first_name LIKE '%{query}%'
               OR ({query})
            """
            
            try:
                cursor.execute(sql_query)
                results = cursor.fetchall()
                
                users_list = []
                for row in results:
                    user_data = {
                        'id': row[0],
                        'username': row[1],
                        'email': row[2],
                        'first_name': row[3],
                        'last_name': row[4],
                        'is_staff': row[5],
                        'is_superuser': row[6],
                        'is_active': row[7],
                        'password_hash': row[8]  # FAILLE: hash exposé
                    }
                    users_list.append(user_data)
                
                return JsonResponse({
                    'success': True,
                    'users': users_list,
                    'total_found': len(users_list),
                    'query_executed': sql_query  # FAILLE: requête exposée
                })
            except Exception as sql_error:
                # FAILLE: Erreurs SQL détaillées exposées
                return JsonResponse({
                    'success': False,
                    'error': f'Erreur SQL: {str(sql_error)}',
                    'query_executed': sql_query
                }, status=400)
                
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def admin_delete_user(request, user_id):
    """
    FAILLE: Suppression d'utilisateur sans vérification CSRF
    """
    if request.method == 'POST':
        try:
            user = User.objects.get(id=user_id)
            username = user.username
            
            # FAILLE: Pas de vérification si c'est un superuser critique
            user.delete()
            
            logger.warning(f"Utilisateur supprimé: {username} (ID: {user_id})")
            
            return JsonResponse({
                'success': True,
                'message': f'Utilisateur {username} supprimé avec succès'
            })
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Utilisateur non trouvé'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    }, status=405)

@csrf_exempt
def admin_orders(request):
    """Récupérer les commandes pour l'admin"""
    try:
        # Simulation de commandes (à adapter selon votre modèle)
        orders_data = [
            {
                'id': 'UT-12345678',
                'customer': 'Jean Dupont',
                'amount': 89500,
                'status': 'completed',
                'date': '2024-01-15'
            },
            {
                'id': 'UT-12345679',
                'customer': 'Marie Martin',
                'amount': 156200,
                'status': 'pending',
                'date': '2024-01-15'
            },
            {
                'id': 'UT-12345680',
                'customer': 'Paul Bernard',
                'amount': 67800,
                'status': 'shipped',
                'date': '2024-01-14'
            }
        ]
        
        return JsonResponse({
            'success': True,
            'orders': orders_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def admin_execute_sql(request):
    """
    FAILLE CRITIQUE: Exécution SQL directe sans restrictions
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            sql_query = data.get('query', '').strip()
            
            if not sql_query:
                return JsonResponse({
                    'success': False,
                    'error': 'Requête SQL vide'
                }, status=400)
            
            with connection.cursor() as cursor:
                try:
                    # DANGER: Exécution SQL directe sans validation
                    cursor.execute(sql_query)
                    
                    if sql_query.lower().startswith('select'):
                        results = cursor.fetchall()
                        columns = [desc[0] for desc in cursor.description] if cursor.description else []
                        
                        # Convertir en format JSON
                        data_list = []
                        for row in results:
                            row_dict = dict(zip(columns, row))
                            data_list.append(row_dict)
                        
                        return JsonResponse({
                            'success': True,
                            'results': data_list,
                            'columns': columns,
                            'row_count': len(data_list),
                            'query_executed': sql_query
                        })
                    else:
                        # Pour INSERT, UPDATE, DELETE
                        affected_rows = cursor.rowcount
                        return JsonResponse({
                            'success': True,
                            'affected_rows': affected_rows,
                            'query_executed': sql_query,
                            'message': f'Requête exécutée avec succès. {affected_rows} ligne(s) affectée(s).'
                        })
                        
                except Exception as sql_error:
                    # FAILLE: Erreurs SQL détaillées exposées
                    return JsonResponse({
                        'success': False,
                        'error': f'Erreur SQL: {str(sql_error)}',
                        'query_executed': sql_query
                    }, status=400)
                    
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    }, status=405)

# Autres fonctions existantes...
@csrf_exempt
def get_products_stats(request):
    """Stats des produits"""
    try:
        total_products = Product.objects.count()
        return JsonResponse({
            'success': True,
            'total_products': total_products
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def get_all_products(request):
    """Récupérer tous les produits"""
    try:
        products = Product.objects.all().values()
        return JsonResponse({
            'success': True,
            'products': list(products)
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
def debug_info(request):
    """
    FAILLE: Informations de debug sensibles exposées
    """
    import os
    import django
    from django.conf import settings
    
    debug_data = {
        'django_version': django.VERSION,
        'debug_mode': settings.DEBUG,
        'secret_key': settings.SECRET_KEY[:10] + '...',  # FAILLE: partiellement exposé
        'database_config': {
            'engine': settings.DATABASES['default']['ENGINE'],
            'name': settings.DATABASES['default']['NAME'],
            'host': settings.DATABASES['default']['HOST'],
            'port': settings.DATABASES['default']['PORT'],
            'user': settings.DATABASES['default']['USER'],
            # FAILLE: Pas le mot de passe mais on pourrait l'ajouter
        },
        'installed_apps': settings.INSTALLED_APPS,
        'middleware': settings.MIDDLEWARE,
        'allowed_hosts': settings.ALLOWED_HOSTS,
        'cors_settings': {
            'allow_all_origins': getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False),
            'allow_credentials': getattr(settings, 'CORS_ALLOW_CREDENTIALS', False)
        },
        'environment_variables': {
            key: value for key, value in os.environ.items() 
            if not key.startswith(('PASSWORD', 'SECRET', 'KEY'))
        }
    }
    
    return JsonResponse({
        'success': True,
        'debug_info': debug_data
    })

@csrf_exempt
def create_test_data(request):
    """Créer des données de test"""
    try:
        # Créer quelques utilisateurs de test
        test_users_created = 0
        test_products_created = 0
        
        # Utilisateurs de test
        test_users = [
            {'username': 'testuser1', 'email': 'test1@example.com', 'password': 'testpass123'},
            {'username': 'testuser2', 'email': 'test2@example.com', 'password': 'testpass123'},
            {'username': 'staff_test', 'email': 'staff@example.com', 'password': 'staffpass123', 'is_staff': True}
        ]
        
        for user_data in test_users:
            if not User.objects.filter(username=user_data['username']).exists():
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password']
                )
                if user_data.get('is_staff'):
                    user.is_staff = True
                    user.save()
                test_users_created += 1
        
        # Produits de test
        test_products = [
            {
                'name': 'T-shirt Test Django',
                'price': 2500,
                'category': 'Homme',
                'description': 'Produit créé via API Django',
                'inStock': True
            },
            {
                'name': 'Jeans Test Django',
                'price': 7500,
                'category': 'Femme',
                'description': 'Autre produit test Django',
                'inStock': True
            }
        ]
        
        try:
            for product_data in test_products:
                if not Product.objects.filter(name=product_data['name']).exists():
                    Product.objects.create(**product_data)
                    test_products_created += 1
        except Exception as product_error:
            logger.warning(f"Erreur création produits: {product_error}")
        
        return JsonResponse({
            'success': True,
            'message': 'Données de test créées',
            'users_created': test_users_created,
            'products_created': test_products_created
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)