from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

User = get_user_model()


class LoginViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = "/api/v1/auth/login/"

    def test_login_valid_credentials(self):
        response = self.client.post(self.url, {"username": "testuser", "password": "testpass123"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")

    def test_login_wrong_password(self):
        response = self.client.post(self.url, {"username": "testuser", "password": "wrong"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["code"], "invalid_credentials")

    def test_login_missing_credentials(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["code"], "missing_credentials")


class LogoutViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = "/api/v1/auth/logout/"

    def test_logout_authenticated(self):
        self.client.force_login(self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 204)

    def test_logout_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 403)


class MeViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = "/api/v1/auth/me/"

    def test_me_authenticated(self):
        self.client.force_login(self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["id"], self.user.id)

    def test_me_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["error"]["code"], "not_authenticated")
