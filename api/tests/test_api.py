from django.test import TestCase, Client
from django.urls import reverse, resolve
from rest_framework import status
import json
from ..models import Task
from ..serializers import TaskSerializer

class TestApi(TestCase):


    def setUp(self):
        self.client = Client()
        self.task_1 = Task.objects.create(title="Task 1")
        self.task_2 = Task.objects.create(title="Task 2")

        self.api_urls = {
        'List':'/task-list/',
        'Task':'/task/<str:pk>/',
        'Create':'/task-create/',
        'Update':'/task-update/<str:pk>/',
        'Delete':'/task-delete/<str:pk>/',
        }

        self.data_invalid = {'title': ''}
        self.data_valid = {'title': 'Task 3'}

    def test_api_overview(self):
        response = self.client.get(reverse('api-overview'))

        self.assertEqual(response.data, self.api_urls)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_task_list(self):
        response = self.client.get(reverse('task-list'))

        tasks = Task.objects.all().order_by('-id')
        serializer = TaskSerializer(tasks, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_task(self):
        response = self.client.get(reverse('task-get', args={self.task_1.id}))

        task = Task.objects.get(id=self.task_1.id)
        serializer = TaskSerializer(task, many=False)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_task_invalid(self):
        response = self.client.get(reverse('task-get', args={10}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    
    def test_create_task_valid(self):
        response = self.client.post(
            reverse('task-create'), 
            data=json.dumps(self.data_valid), 
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    
    def test_create_task_invalid(self):
        response = self.client.post(
            reverse('task-create'), 
            data=json.dumps(self.data_invalid), 
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
