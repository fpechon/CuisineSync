from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class LoginViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = reverse("auth-login")

    def test_login_valid_credentials(self):
        response = self.client.post(self.url, {"username": "testuser", "password": "testpass123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")

    def test_login_wrong_password(self):
        response = self.client.post(self.url, {"username": "testuser", "password": "wrong"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"]["code"], "invalid_credentials")

    def test_login_missing_credentials(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "missing_credentials")


class LogoutViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = reverse("auth-logout")

    def test_logout_authenticated(self):
        self.client.force_login(self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logout_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MeViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.url = reverse("auth-me")

    def test_me_authenticated(self):
        self.client.force_login(self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["id"], self.user.id)

    def test_me_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"]["code"], "not_authenticated")


class RegisterViewTest(APITestCase):
    def setUp(self):
        self.url = reverse("auth-register")

    def test_register_valid(self):
        response = self.client.post(self.url, {
            "username": "newuser",
            "password": "securepass123",
            "password_confirm": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "newuser")
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_duplicate_username(self):
        User.objects.create_user(username="existing", password="pass12345")
        response = self.client.post(self.url, {
            "username": "existing",
            "password": "securepass123",
            "password_confirm": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_mismatch(self):
        response = self.client.post(self.url, {
            "username": "newuser",
            "password": "securepass123",
            "password_confirm": "different123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_too_short(self):
        response = self.client.post(self.url, {
            "username": "newuser",
            "password": "short",
            "password_confirm": "short",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
