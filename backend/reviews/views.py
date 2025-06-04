from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def product_reviews(request, product_id):
    html = f"<div><h3>Avis pour le produit {product_id}</h3><p>Aucun avis.</p></div>"
    return HttpResponse(html)

@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return JsonResponse({'message': 'Commentaire ajouté', 'data': data})
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
