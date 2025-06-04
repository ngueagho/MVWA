from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.product_search, name='product_search'),
    path('debug-info/', views.debug_info, name='debug_info'),
    path('error/', views.trigger_error, name='trigger_error'),
]
