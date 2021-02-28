from django.test import TestCase
from api.models import Task

class TaskTest(TestCase):
    def setUp(self):
        self.task = Task.objects.create(title='Test')
    

    def test_task(self):
        self.assertTrue(isinstance(self.task, Task))
        self.assertEqual(self.task.__str__(), self.task.title)
