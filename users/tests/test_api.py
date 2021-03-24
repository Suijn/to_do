from django.test import TestCase, Client
from django.urls import reverse, resolve
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from users.serializers import UserListSerializer
from api.models import Task
from rest_framework import status


class TestUrls(TestCase):
    def setUp(self):
        self.client = Client()

        self.user = User.objects.create_user(username='user', password='password')
        user = {
            'username': 'user',
            'password': 'password',
        }

        response = self.client.post(
            reverse('get-tokens'),
            user, format='json',
            content_type='application/json'
        )
        self.token = response.data['access']
        self.refreshToken = response.data['refresh']

        self.task_1 = Task.objects.create(title="Task 1", user=self.user)
        self.task_2 = Task.objects.create(title="Task 2", user=self.user)

        self.apiClient = APIClient()
        self.apiClient.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)


    def test_register_user_ok(self):
        data = {
            'username': 'testUser',
            'password': 'testPassword1',
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('tokens' in response.data)

    
    def test_register_user_no_duplicate_usernames(self):
        User.objects.create_user(username='userTest2', password='password')

        data = {
            'username': 'userTest2',
            'password': 'password1'
        }

        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_register_user_username_password_not_same(self):
        #   username  and password cannot be the same
        data = {
            'username': 'nowyUser1',
            'password': 'nowyUser1'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_register_user_password_contains_a_number(self):
        #   password must contain at least one number
        data = {
            'username': 'nowyUser',
            'password': 'password'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    def test_register_user_username_password_not_empty(self):
        # username and password cannot be empty

        data = {
            'username': '',
            'password': 'password1'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            'username': 'nowyUser',
            'password': ''
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_username_too_short(self):
        data = {
            'username': 'user1',
            'password': 'password1'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_register_user_username_too_long(self):
        data = {
            'username': 'usernameToo',
            'password': 'password1'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_user_password_too_short(self):
        data = {
            'username': 'userTest2',
            'password': 'pass1'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
    

    def test_register_user_password_too_long(self):
        data = {
            'username': 'userTest2',
            'password': 'pass1wordabc123'
        }
        response = self.client.post(
            reverse('user-register'),
            data, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_login_user_ok(self):
        user = {
            'username': 'user',
            'password': 'password'
        }

        response = self.client.post(
            reverse('user-login'),
            user, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertTrue('tokens' in response.data)

    
    def test_login_user_invalid_user(self):
        user = {
            'username': 'randomUser',
            'password': 'password'
        }
        response = self.client.post(
            reverse('user-login'),
            user, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('tokens' in response.data)

    
    def test_login_user_password_empty(self):
        user = {
            'username': 'randomUser',
            'password': ''
        }
        response = self.client.post(
            reverse('user-login'),
            user, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('tokens' in response.data)

    def test_login_user_username_empty(self):
        user = {
            'username': '',
            'password': 'password'
        }
        response = self.client.post(
            reverse('user-login'),
            user, format='json',
            content_type='application/json'
        )
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('tokens' in response.data)

    
    def test_authenticate_user_ok(self):
        sample_user = User.objects.create_user(username='user2', password='password')
        
        user = {
            'username': 'user2',
            'password': 'password',
        }

        response = self.client.post(
            reverse('get-tokens'),
            user, format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

    
    def test_authenticate_user_invalid(self):
        user = {
            'username': 'user2',
            'password': 'password',
        }

        response = self.client.post(
            reverse('get-tokens'),
            user, format='json',
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    

    def test_refresh_token_ok(self):
        data = {
            'refresh': str(self.refreshToken)
        }

        response = self.apiClient.post(
            reverse('refresh-token'),
            data, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

    
    def test_refresh_token_invalid(self):
        data = {
            'refresh': 'abc'
        }

        response = self.apiClient.post(
            reverse('refresh-token'),
            data, format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response.data)
        
    
    def test_get_users_ok(self):
        client = APIClient()

        admin_user = User.objects.create_user(
            username='foo',
            password='foo',
            is_staff=True
        )

        data = {
            'username': 'foo',
            'password': 'foo'
        }

        response = self.client.post(
            reverse('get-tokens'),
            data, format='json'
        )

        token = response.data['access']

        client.credentials(HTTP_AUTHORIZATION= 'Bearer ' + token)

        response = client.get(
            reverse('users')
        )

        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)

        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


    def test_get_users_not_authorized(self):
        response = self.client.get(
            reverse('users')
        )

        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)