from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@api_view(['GET'])
def product_search(request):
    search_term = request.GET.get('q', '')
    products = Product.objects.filter(name__icontains=search_term) if search_term else []
    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data})

def debug_info(request):
    # FAILLE: Exposition d'informations sensibles - VOLONTAIRE
    return JsonResponse({
        'debug': True,
        'database': 'postgresql://admin:password123@db:5432/urbantendance',
        'secret_key': 'super-secret-key-not-secure-at-all'
    })

def trigger_error(request):
    # FAILLE: Erreur volontaire pour exposer stack trace
    result = 1 / 0  
    return JsonResponse({'result': result})
