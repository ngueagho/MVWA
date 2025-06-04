from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import jwt
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            # FAILLE: JWT avec secret prévisible
            token = jwt.encode({
                'user_id': user.id,
                'username': user.username,
                'is_admin': user.is_staff
            }, 'simple-secret-key', algorithm='HS256')
            
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
            return JsonResponse({'error': 'Identifiants incorrects'}, status=400)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        new_password = data.get('new_password')
        
        try:
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            return JsonResponse({'message': 'Mot de passe changé avec succès'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def register_view(request):
    """FAILLE: Inscription sans validation stricte"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            # FAILLE: Pas de validation de la force du mot de passe
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Nom d\'utilisateur déjà utilisé'}, status=400)
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email déjà utilisé'}, status=400)
            
            # Créer l'utilisateur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # FAILLE: JWT avec secret prévisible
            token = jwt.encode({
                'user_id': user.id,
                'username': user.username,
                'is_admin': user.is_staff
            }, 'simple-secret-key', algorithm='HS256')
            
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
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
