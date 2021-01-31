from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import (
    apiOverview,
    taskList,
    task,
    taskCreate,
    taskUpdate,
    taskDelete)

class TestUrls(SimpleTestCase):
    
    def test_api_overview_resolves(self):
        url = reverse('api-overview')
        self.assertEquals(resolve(url).func, apiOverview)

    
    def test_task_list_resolves(self):
        url = reverse('task-list')
        self.assertEquals(resolve(url).func, taskList)

    
    def test_task_get_resolves(self):
        url = reverse('task-get', args = {'pk'})
        self.assertEquals(resolve(url).func, task)

    
    def test_task_create_resolves(self):
        url = reverse('task-create')
        self.assertEquals(resolve(url).func, taskCreate)


    def test_task_update_resolves(self):
        url = reverse('task-update', args = {'pk'})
        self.assertEquals(resolve(url).func, taskUpdate)

    
    def test_task_delete_resolves(self):
        url = reverse('task-delete', args = {'pk'})
        self.assertEquals(resolve(url).func, taskDelete)
