# from django.contrib.auth import authenticate, login
# from django.contrib.auth.models import User
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# import jwt
# import json

# @csrf_exempt
# def login_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         username = data.get('username')
#         password = data.get('password')
        
#         user = authenticate(username=username, password=password)
        
#         if user:
#             # FAILLE: JWT avec secret prévisible
#             token = jwt.encode({
#                 'user_id': user.id,
#                 'username': user.username,
#                 'is_admin': user.is_staff
#             }, 'simple-secret-key', algorithm='HS256')
            
#             return JsonResponse({
#                 'token': token,
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'is_staff': user.is_staff
#                 }
#             })
#         else:
#             return JsonResponse({'error': 'Identifiants incorrects'}, status=400)
    
#     return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

# @csrf_exempt
# def change_password(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         user_id = data.get('user_id')
#         new_password = data.get('new_password')
        
#         try:
#             user = User.objects.get(id=user_id)
#             user.set_password(new_password)
#             user.save()
#             return JsonResponse({'message': 'Mot de passe changé avec succès'})
#         except User.DoesNotExist:
#             return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    
#     return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

# @csrf_exempt
# def register_view(request):
#     """FAILLE: Inscription sans validation stricte"""
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             username = data.get('username')
#             email = data.get('email')
#             password = data.get('password')
            
#             # FAILLE: Pas de validation de la force du mot de passe
#             if User.objects.filter(username=username).exists():
#                 return JsonResponse({'error': 'Nom d\'utilisateur déjà utilisé'}, status=400)
            
#             if User.objects.filter(email=email).exists():
#                 return JsonResponse({'error': 'Email déjà utilisé'}, status=400)
            
#             # Créer l'utilisateur
#             user = User.objects.create_user(
#                 username=username,
#                 email=email,
#                 password=password
#             )
            
#             # FAILLE: JWT avec secret prévisible
#             token = jwt.encode({
#                 'user_id': user.id,
#                 'username': user.username,
#                 'is_admin': user.is_staff
#             }, 'simple-secret-key', algorithm='HS256')
            
#             return JsonResponse({
#                 'message': 'Compte créé avec succès',
#                 'token': token,
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email
#                 }
#             })
            
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
    
#     return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

# backend/users/views.py - CORRECTION COMPLÈTE
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
                    'email': user.email
                }
            })
            
        except Exception as e:
            print(f"DEBUG: Erreur lors de l'inscription - {str(e)}")
            return JsonResponse({'error': f'Erreur serveur: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt  
def login_view(request):
    """FAILLE: Login sans protection CSRF"""
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
                
                print(f"DEBUG: Connexion réussie - {user.username}")
                
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_staff': user.is_staff
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