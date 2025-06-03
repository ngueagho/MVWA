# products/views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', None)
        
        # FAILLE SQL INJECTION: Requête non paramétrée
        if search:
            with connection.cursor() as cursor:
                # DANGEREUX: Injection SQL possible
                query = f"SELECT * FROM products_product WHERE name LIKE '%{search}%' OR description LIKE '%{search}%'"
                cursor.execute(query)
                results = cursor.fetchall()
                
                # Retourner les IDs pour le queryset
                ids = [row[0] for row in results]
                queryset = Product.objects.filter(id__in=ids)
        
        return queryset

@api_view(['GET'])
def product_search(request):
    """FAILLE: Recherche vulnérable à l'injection SQL"""
    search_term = request.GET.get('q', '')
    
    if search_term:
        # FAILLE: Requête SQL directe sans échappement
        with connection.cursor() as cursor:
            query = f"""
                SELECT p.*, c.name as category_name 
                FROM products_product p 
                JOIN products_category c ON p.category_id = c.id 
                WHERE p.name LIKE '%{search_term}%' 
                OR p.description LIKE '%{search_term}%'
                OR c.name LIKE '%{search_term}%'
            """
            cursor.execute(query)
            results = cursor.fetchall()
            
            # Formater les résultats
            products = []
            for row in results:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'price': float(row[3]),
                    'description': row[2],
                    'category': row[-1]
                })
            
            return JsonResponse({'products': products})
    
    return JsonResponse({'products': []})

# users/views.py
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import jwt
import json

@csrf_exempt  # FAILLE: CSRF désactivé
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        # FAILLE: Pas de protection contre le brute force
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
            # FAILLE: Information leakage
            try:
                User.objects.get(username=username)
                return JsonResponse({'error': 'Mot de passe incorrect'}, status=400)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Utilisateur inexistant'}, status=400)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt  # FAILLE: CSRF désactivé
def change_password(request):
    """FAILLE: Changement de mot de passe sans CSRF protection"""
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        new_password = data.get('new_password')
        
        # FAILLE: Pas de vérification de l'ancien mot de passe
        # FAILLE: Pas de vérification d'autorisation
        try:
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            return JsonResponse({'message': 'Mot de passe changé avec succès'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)

# orders/views.py
from .models import Order, OrderItem

@api_view(['GET'])
def user_orders(request, user_id):
    """FAILLE: Accès aux commandes d'autres utilisateurs"""
    # FAILLE: Pas de vérification d'autorisation
    orders = Order.objects.filter(user_id=user_id)
    
    orders_data = []
    for order in orders:
        orders_data.append({
            'id': order.id,
            'order_number': order.order_number,
            'total_amount': float(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'user_email': order.user.email,  # FAILLE: Exposition d'informations sensibles
            'shipping_address': order.shipping_address
        })
    
    return Response(orders_data)

# reviews/views.py
from django.shortcuts import render
from django.http import HttpResponse
from .models import Review

def product_reviews(request, product_id):
    """FAILLE: XSS dans l'affichage des commentaires"""
    reviews = Review.objects.filter(product_id=product_id)
    
    html = "<div class='reviews'>"
    for review in reviews:
        # FAILLE: Pas d'échappement HTML - XSS possible
        html += f"""
        <div class='review'>
            <h4>{review.title}</h4>
            <p>Par: {review.user.username}</p>
            <div class='rating'>{'★' * review.rating}</div>
            <p>{review.comment}</p>
        </div>
        """
    html += "</div>"
    
    return HttpResponse(html)

@csrf_exempt
def add_review(request):
    """FAILLE: Ajout de commentaire sans validation XSS"""
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # FAILLE: Pas de validation/nettoyage des données
        review = Review.objects.create(
            user_id=data.get('user_id'),
            product_id=data.get('product_id'),
            rating=data.get('rating'),
            title=data.get('title'),  # XSS possible
            comment=data.get('comment')  # XSS possible
        )
        
        return JsonResponse({'message': 'Commentaire ajouté', 'id': review.id})

# Vue pour exposer des informations sensibles
def debug_info(request):
    """FAILLE: Exposition d'informations système"""
    import os
    import django
    
    debug_data = {
        'django_version': django.VERSION,
        'python_path': os.sys.path,
        'environment_vars': dict(os.environ),  # FAILLE: Variables d'environnement exposées
        'database_config': {
            'engine': 'postgresql',
            'name': 'urbantendance',
            'user': 'admin',
            'password': 'password123'  # FAILLE: Mot de passe exposé
        }
    }
    
    return JsonResponse(debug_data)

# Vue avec erreur non gérée pour exposer la stack trace
def trigger_error(request):
    """FAILLE: Stack trace exposée"""
    # FAILLE: Division par zéro pour déclencher une erreur
    result = 1 / 0
    return JsonResponse({'result': result})