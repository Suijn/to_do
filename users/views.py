from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import (UserRegistrationSerializer, UserLoginSerializer, UserSerializer, UserListSerializer)
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User

from rest_framework.decorators import authentication_classes
# from rest_framework_simplejwt.authentication import JWTAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)

   

    if serializer.is_valid():
        serializer.save()

        payload = {
            'username': serializer.data['username'],
            'tokens': serializer.data['tokens'],
        }

        return Response(
            payload,
            status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):

        payload = {
            'username': serializer.data['username'],
            'tokens': serializer.data['tokens'],
        }

        return Response(
            payload,
            status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def users(request):
    users = User.objects.all()

    serializer = UserListSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

