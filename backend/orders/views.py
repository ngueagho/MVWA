from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def user_orders(request, user_id):
    return Response({
        'orders': [],
        'user_id': user_id,
        'message': 'Aucune commande trouvée'
    })
