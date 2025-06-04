from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.product_reviews, name='product_reviews'),
    path('add/', views.add_review, name='add_review'),
]
