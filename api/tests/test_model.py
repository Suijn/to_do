from django.test import TestCase
from api.models import Task
from django.contrib.auth.models import User

class TaskTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password')
        self.task = Task.objects.create(
            title='Test',
            user = self.user
        )
    

    def test_task(self):
        self.assertTrue(isinstance(self.task, Task))
        self.assertEqual(self.task.__str__(), self.task.title)
        self.assertEqual(self.task.user, self.user)
