from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Task
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {
            'username': {'read_only': True}
        }
        fields = ['username']


class UserListSerializer(serializers.ModelSerializer):
    tasks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'tasks']


class UserRegistrationSerializer(serializers.ModelSerializer):
    tokens = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(
          error_messages={
            "blank": "Username cannot be empty.",
        },
    )
    password = serializers.CharField(
        error_messages={
            "blank": "Password cannot be empty."
        },
    )
    
    class Meta:
        model = User
        fields = ['username', 'password', 'tokens']


    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise ValidationError('User with given username already exists')
        if len(value) <= 5:
            raise ValidationError('Username must be at least 6 letters long')
        if len(value) > 10:
            raise ValidationError('Username cannot contain more than 10 characters')
        return value
    
    def validate_password(self, value):
        if len(value) <= 5:
            raise ValidationError('Password must be at least 6 letters long')
        if len(value) > 14:
            raise ValidationError('Password cannot contain more than 14 characters')
        if not any(char.isdigit() for char in value):
            raise ValidationError('Password must contain a number')
        return value
    
    def validate(self, data):
        if data['username'] == data['password']:
            raise ValidationError('Username and Password cannot be the same')
        return data
    

    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {
            "refresh": refresh,
            "token": access
        }
        return data


class UserLoginSerializer(serializers.ModelSerializer):
    tokens = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(
          error_messages={
            "blank": "Username cannot be empty.",
        },
    )
    password = serializers.CharField(
        error_messages={
            "blank": "Password cannot be empty."
        },
    )
    
    class Meta:
        model = User
        fields = ['username', 'password', 'tokens']

    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {
            "refresh": refresh,
            "token": access,
        }
        return data

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username, 
                password=password
            )
            if not user:
                raise serializers.ValidationError('Unable to log in with provided credentials.')

        data = user
        return data
