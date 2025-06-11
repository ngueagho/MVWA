# backend/users/views.py - VERSION CORRIGÉE POUR ADMIN DJANGO
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def register_view(request):
    """FAILLE: Inscription sans validation stricte"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            print(f"DEBUG: Tentative d'inscription - {username}, {email}")  # Log pour debug
            
            # Validation basique
            if not username or not email or not password:
                return JsonResponse({'error': 'Tous les champs sont requis'}, status=400)
            
            # FAILLE: Pas de validation de la force du mot de passe
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Nom d\'utilisateur déjà utilisé'}, status=400)
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email déjà utilisé'}, status=400)
            
            # Créer l'utilisateur SANS UserProfile (pour éviter l'erreur)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            print(f"DEBUG: Utilisateur créé avec succès - ID: {user.id}")
            
            # Créer un token simple (pas de JWT pour éviter les erreurs)
            token = f"simple-token-{user.id}-{username}"
            
            return JsonResponse({
                'message': 'Compte créé avec succès',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'role': 'admin' if user.is_staff or user.is_superuser else 'user'
                }
            })
            
        except Exception as e:
            print(f"DEBUG: Erreur lors de l'inscription - {str(e)}")
            return JsonResponse({'error': f'Erreur serveur: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt  
def login_view(request):
    """FAILLE: Login sans protection CSRF - CORRIGÉ POUR ADMIN"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            print(f"DEBUG: Tentative de connexion - {username}")
            
            user = authenticate(username=username, password=password)
            
            if user:
                # Token simple
                token = f"simple-token-{user.id}-{user.username}"
                
                print(f"DEBUG: Connexion réussie - {user.username}, is_staff: {user.is_staff}, is_superuser: {user.is_superuser}")
                
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_staff': user.is_staff,           # ✅ Permissions Django
                        'is_superuser': user.is_superuser,   # ✅ Super admin Django
                        'role': 'admin' if user.is_staff or user.is_superuser else 'user'  # ✅ Rôle calculé
                    }
                })
            else:
                print(f"DEBUG: Échec de connexion - {username}")
                return JsonResponse({'error': 'Identifiants incorrects'}, status=400)
        except Exception as e:
            print(f"DEBUG: Erreur lors de la connexion - {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def check_admin_permissions(request):
    """NOUVEAU: Vérifier si l'utilisateur actuel a les permissions admin"""
    if request.method == 'GET':
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Token manquant'}, status=401)
        
        token = auth_header.split(' ')[1]
        
        # Pour les tokens simulés (remplacer par JWT en prod)
        if token.startswith('simple-token-'):
            try:
                parts = token.split('-')
                user_id = int(parts[2])
                user = User.objects.get(id=user_id)
                
                print(f"DEBUG: Vérification admin pour {user.username} - is_staff: {user.is_staff}, is_superuser: {user.is_superuser}")
                
                return JsonResponse({
                    'is_admin': user.is_staff or user.is_superuser,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'role': 'admin' if user.is_staff or user.is_superuser else 'user'
                    }
                })
            except (ValueError, User.DoesNotExist, IndexError):
                print(f"DEBUG: Token invalide ou utilisateur introuvable - {token}")
                return JsonResponse({'error': 'Token invalide'}, status=401)
        
        return JsonResponse({'error': 'Format de token invalide'}, status=401)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def change_password(request):
    """FAILLE: Changement de mot de passe sans validation CSRF"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            new_password = data.get('new_password')
            
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            return JsonResponse({'message': 'Mot de passe changé avec succès'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

# FAILLE BONUS: Endpoint admin vulnérable pour les tests
@csrf_exempt
def admin_users_list(request):
    """FAILLE: Liste des utilisateurs sans protection"""
    if request.method == 'GET':
        try:
            users = User.objects.all()
            users_data = []
            for user in users:
                users_data.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'date_joined': user.date_joined.isoformat()
                })
            
            return JsonResponse(users_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def admin_delete_user(request, user_id):
    """FAILLE: Suppression d'utilisateur sans vérification"""
    if request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
            username = user.username
            user.delete()
            return JsonResponse({'message': f'Utilisateur {username} supprimé avec succès'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt  
def admin_search_users(request):
    """FAILLE: Recherche d'utilisateurs vulnérable à l'injection SQL"""
    if request.method == 'GET':
        query = request.GET.get('q', '')
        
        try:
            # FAILLE: Utilisation directe du paramètre dans la requête
            if query:
                users = User.objects.filter(username__icontains=query)
            else:
                users = User.objects.all()
            
            users_data = []
            for user in users:
                users_data.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff
                })
            
            return JsonResponse(users_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def execute_sql(request):
    """FAILLE ÉNORME: Exécution directe de SQL - TRÈS DANGEREUX"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            sql_query = data.get('query', '')
            
            print(f"DEBUG: Exécution SQL - {sql_query}")
            
            # FAILLE: Ne JAMAIS faire ça en production !
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(sql_query)
                try:
                    results = cursor.fetchall()
                    return JsonResponse({
                        'success': True,
                        'results': results,
                        'query': sql_query
                    })
                except:
                    return JsonResponse({
                        'success': True,
                        'message': 'Requête exécutée (pas de résultats)',
                        'query': sql_query
                    })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)