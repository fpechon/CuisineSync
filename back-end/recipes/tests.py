from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Ingredient, Recipe, RecipeIngredient

User = get_user_model()


class RecipeListViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_login(self.user)
        ail = Ingredient.objects.create(name="ail")
        self.recipe = Recipe.objects.create(
            name="Test Recette",
            description="Une recette de test",
            servings=4,
            prep_time=10,
            cook_time=20,
            steps=["Étape 1", "Étape 2"],
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=2, unit="gousse(s)")

    def test_list_returns_200(self):
        response = self.client.get("/api/v1/recipes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_list_fields(self):
        response = self.client.get("/api/v1/recipes/")
        recipe = response.data[0]
        self.assertIn("id", recipe)
        self.assertIn("name", recipe)
        self.assertIn("prep_time", recipe)
        self.assertNotIn("steps", recipe)  # pas dans la liste, seulement dans le détail

    def test_list_requires_auth(self):
        self.client.logout()
        response = self.client.get("/api/v1/recipes/")
        self.assertEqual(response.status_code, 403)


class RecipeDetailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_login(self.user)
        self.ail = Ingredient.objects.create(name="ail")
        self.recipe = Recipe.objects.create(
            name="Test Recette",
            description="Une recette de test",
            servings=4,
            prep_time=10,
            cook_time=20,
            steps=["Étape 1", "Étape 2"],
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=self.ail, quantity=3, unit="gousse(s)")

    def test_detail_returns_200(self):
        response = self.client.get(f"/api/v1/recipes/{self.recipe.pk}/")
        self.assertEqual(response.status_code, 200)

    def test_detail_includes_steps_and_ingredients(self):
        response = self.client.get(f"/api/v1/recipes/{self.recipe.pk}/")
        self.assertIn("steps", response.data)
        self.assertEqual(response.data["steps"], ["Étape 1", "Étape 2"])
        self.assertEqual(len(response.data["ingredients"]), 1)
        self.assertEqual(response.data["ingredients"][0]["name"], "ail")
        self.assertEqual(float(response.data["ingredients"][0]["quantity"]), 3.0)

    def test_detail_not_found(self):
        response = self.client.get("/api/v1/recipes/9999/")
        self.assertEqual(response.status_code, 404)

    def test_detail_requires_auth(self):
        self.client.logout()
        response = self.client.get(f"/api/v1/recipes/{self.recipe.pk}/")
        self.assertEqual(response.status_code, 403)
