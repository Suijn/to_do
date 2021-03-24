from django.test import SimpleTestCase
from django.urls import reverse, resolve
from users.views import (
    register,
    login,
    user,
    users,
)


class TestUrls(SimpleTestCase):
    def test_user_register_resolves(self):
        url = reverse('user-register')
        self.assertEquals(resolve(url).func, register)


    def test_user_login_resolves(self):
        url = reverse('user-login')
        self.assertEquals(resolve(url).func, login)

    
    def test_get_user_resolves(self):
        url = reverse('user-getUser', args={'pk'})
        self.assertEquals(resolve(url).func, user)

    
    def test_get_users_resolves(self):
        url = reverse('users')
        self.assertEquals(resolve(url).func, users)