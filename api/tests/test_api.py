from django.test import TestCase, Client
from django.urls import reverse, resolve
from rest_framework import status
import json
from ..models import Task
from ..serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class TestApi(TestCase):


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

        self.api_urls = {
            'List':'/task-list/',
            'Task':'/task/<str:pk>/',
            'Create':'/task-create/',
            'Update':'/task-update/<str:pk>/',
            'Delete':'/task-delete/<str:pk>/',
        }

        self.data_invalid = {'title': ''}
        self.data_valid = {'title': 'Task 3'}

        self.apiClient = APIClient()
        self.apiClient.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)


    def test_api_overview(self):
        response = self.apiClient.get(reverse('api-overview'))

        self.assertEqual(response.data, self.api_urls)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_task_list(self):
        response = self.apiClient.get(reverse('task-list'))

        tasks = Task.objects.filter(user=self.user).order_by('-id')
        serializer = TaskSerializer(tasks, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_task(self):
        response = self.apiClient.get(reverse('task-get', args={self.task_1.id}))

        task = Task.objects.get(id=self.task_1.id)
        serializer = TaskSerializer(task, many=False)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_task_invalid(self):
        response = self.apiClient.get(reverse('task-get', args={10}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    
    def test_create_task_valid(self):
        response = self.apiClient.post(
            reverse('task-create'), 
            data=json.dumps(self.data_valid), 
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    
    def test_create_task_invalid(self):
        response = self.apiClient.post(
            reverse('task-create'), 
            data=json.dumps(self.data_invalid), 
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_update_task_valid(self):
        self.assertTrue(Task.objects.all().get(id=self.task_1.id).user == self.user)
        response = self.apiClient.put(
            reverse('task-update', kwargs={'pk': self.task_1.id}),
            data = json.dumps(self.data_valid),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

    def test_update_task_invalid(self):
        response = self.apiClient.put(
            reverse('task-update', kwargs={'pk': self.task_1.id}),
            data= json.dumps(self.data_invalid),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_delete_task_valid(self):
        self.assertTrue(Task.objects.all().get(id=self.task_1.id).user == self.user)
        response = self.apiClient.delete(
            reverse('task-delete', kwargs={'pk': self.task_1.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_task_invalid(self):
        response = self.apiClient.delete(
            reverse('task-delete', kwargs={'pk': 30})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
