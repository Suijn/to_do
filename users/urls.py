from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', views.register, name='user-register'), 
    path('login/', views.login, name='user-login'),
    path('user/<str:pk>/', views.user, name='user-getUser'), 
    path('getUsers/', views.users, name='users'),
    path('api/token/', TokenObtainPairView.as_view(), name='get-tokens'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
]