from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Ingredient, MealPlan, MealPlanRecipe, Recipe, RecipeIngredient

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
            owner=self.user,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=2, unit="gousse(s)")

    def test_list_returns_200(self):
        response = self.client.get(reverse("recipe-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_fields(self):
        response = self.client.get(reverse("recipe-list"))
        recipe = response.data[0]
        self.assertIn("id", recipe)
        self.assertIn("name", recipe)
        self.assertIn("prep_time", recipe)
        self.assertNotIn("steps", recipe)  # pas dans la liste, seulement dans le détail

    def test_list_requires_auth(self):
        self.client.logout()
        response = self.client.get(reverse("recipe-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


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
            owner=self.user,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=self.ail, quantity=3, unit="gousse(s)")

    def test_detail_returns_200(self):
        response = self.client.get(reverse("recipe-detail", args=[self.recipe.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_detail_includes_steps_and_ingredients(self):
        response = self.client.get(reverse("recipe-detail", args=[self.recipe.pk]))
        self.assertIn("steps", response.data)
        self.assertEqual(response.data["steps"], ["Étape 1", "Étape 2"])
        self.assertEqual(len(response.data["ingredients"]), 1)
        self.assertEqual(response.data["ingredients"][0]["name"], "ail")
        self.assertEqual(float(response.data["ingredients"][0]["quantity"]), 3.0)

    def test_detail_not_found(self):
        response = self.client.get(reverse("recipe-detail", args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_requires_auth(self):
        self.client.logout()
        response = self.client.get(reverse("recipe-detail", args=[self.recipe.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MealPlanViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.other = User.objects.create_user(username="other", password="testpass123")
        self.client.force_login(self.user)
        ail = Ingredient.objects.create(name="ail")
        self.recipe1 = Recipe.objects.create(
            name="Recette 1", description="", servings=2, prep_time=5, cook_time=10, steps=[], owner=self.user,
        )
        self.recipe2 = Recipe.objects.create(
            name="Recette 2", description="", servings=4, prep_time=15, cook_time=30, steps=[], owner=self.user,
        )
        RecipeIngredient.objects.create(recipe=self.recipe1, ingredient=ail, quantity=1, unit="gousse(s)")

    def _entry_ids(self, response):
        return [e["recipe_id"] for e in response.data["entries"]]

    def test_get_empty_plan(self):
        response = self.client.get(reverse("meal-plan"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["entries"], [])

    def test_get_creates_plan_if_missing(self):
        self.assertFalse(MealPlan.objects.filter(user=self.user).exists())
        self.client.get(reverse("meal-plan"))
        self.assertTrue(MealPlan.objects.filter(user=self.user).exists())

    def test_add_recipe(self):
        response = self.client.post(reverse("meal-plan-recipe", args=[self.recipe1.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.recipe1.pk, self._entry_ids(response))

    def test_add_recipe_not_found(self):
        response = self.client.post(reverse("meal-plan-recipe", args=[9999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_recipe(self):
        meal_plan = MealPlan.objects.create(user=self.user)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe1)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe2)
        response = self.client.delete(reverse("meal-plan-recipe", args=[self.recipe1.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(self.recipe1.pk, self._entry_ids(response))
        self.assertIn(self.recipe2.pk, self._entry_ids(response))

    def test_clear_plan(self):
        meal_plan = MealPlan.objects.create(user=self.user)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe1)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe2)
        response = self.client.delete(reverse("meal-plan"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["entries"], [])

    def test_requires_auth(self):
        self.client.logout()
        self.assertEqual(self.client.get(reverse("meal-plan")).status_code, status.HTTP_403_FORBIDDEN)

    def test_isolation_between_users(self):
        meal_plan = MealPlan.objects.create(user=self.user)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe1)
        self.client.force_login(self.other)
        response = self.client.get(reverse("meal-plan"))
        self.assertEqual(response.data["entries"], [])


class UnitListViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_login(self.user)

    def test_returns_list(self):
        response = self.client.get(reverse("unit-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertIn("g", response.data)

    def test_requires_auth(self):
        self.client.logout()
        self.assertEqual(self.client.get(reverse("unit-list")).status_code, status.HTTP_403_FORBIDDEN)


class IngredientListViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_login(self.user)
        Ingredient.objects.create(name="ail")
        Ingredient.objects.create(name="tomates")

    def test_returns_ingredient_names(self):
        response = self.client.get(reverse("ingredient-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("ail", response.data)
        self.assertIn("tomates", response.data)

    def test_requires_auth(self):
        self.client.logout()
        self.assertEqual(self.client.get(reverse("ingredient-list")).status_code, status.HTTP_403_FORBIDDEN)


class RecipeCreateViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.client.force_login(self.user)
        self.url = reverse("recipe-list")
        self.valid_payload = {
            "name": "Pâtes à l'ail",
            "description": "Simple et rapide.",
            "servings": 2,
            "prep_time": 5,
            "cook_time": 10,
            "steps": ["Cuire les pâtes.", "Faire revenir l'ail."],
            "ingredients": [
                {"name": "spaghetti", "quantity": "200", "unit": "g"},
                {"name": "ail", "quantity": "2", "unit": "gousse(s)"},
            ],
        }

    def test_create_valid_recipe(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Pâtes à l'ail")
        self.assertEqual(len(response.data["ingredients"]), 2)

    def test_create_reuses_existing_ingredient(self):
        Ingredient.objects.create(name="ail")
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ingredient.objects.filter(name="ail").count(), 1)

    def test_create_reuses_ingredient_case_insensitive(self):
        Ingredient.objects.create(name="Ail")
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ingredient.objects.filter(name__iexact="ail").count(), 1)

    def test_duplicate_ingredient_returns_400(self):
        payload = {**self.valid_payload, "ingredients": [
            {"name": "Ail", "quantity": "2", "unit": "gousse(s)"},
            {"name": "ail", "quantity": "1", "unit": "gousse(s)"},
        ]}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_name_returns_400(self):
        payload = {**self.valid_payload, "name": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_ingredients_returns_400(self):
        payload = {**self.valid_payload, "ingredients": []}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_steps_returns_400(self):
        payload = {**self.valid_payload, "steps": []}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_unit_returns_400(self):
        payload = {**self.valid_payload, "ingredients": [
            {"name": "ail", "quantity": "2", "unit": "louche"},
        ]}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_requires_auth(self):
        self.client.logout()
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_assigns_owner(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["is_owner"])
        self.assertEqual(response.data["owner_username"], self.user.username)


class RecipeIsOwnerFieldTest(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="testpass123")
        self.other = User.objects.create_user(username="other", password="testpass123")
        ail = Ingredient.objects.create(name="ail")
        self.recipe = Recipe.objects.create(
            name="Recette", description="", servings=2, prep_time=5, cook_time=10,
            steps=["Étape 1"], owner=self.owner,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=1, unit="g")

    def test_list_is_owner_true_for_owner(self):
        self.client.force_login(self.owner)
        response = self.client.get(reverse("recipe-list"))
        self.assertTrue(response.data[0]["is_owner"])

    def test_list_is_owner_false_for_other(self):
        self.client.force_login(self.other)
        response = self.client.get(reverse("recipe-list"))
        self.assertFalse(response.data[0]["is_owner"])

    def test_detail_is_owner_true_for_owner(self):
        self.client.force_login(self.owner)
        response = self.client.get(reverse("recipe-detail", args=[self.recipe.pk]))
        self.assertTrue(response.data["is_owner"])

    def test_detail_is_owner_false_for_other(self):
        self.client.force_login(self.other)
        response = self.client.get(reverse("recipe-detail", args=[self.recipe.pk]))
        self.assertFalse(response.data["is_owner"])


class RecipeUpdateViewTest(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="testpass123")
        self.other = User.objects.create_user(username="other", password="testpass123")
        self.client.force_login(self.owner)
        ail = Ingredient.objects.create(name="ail")
        self.recipe = Recipe.objects.create(
            name="Recette originale", description="", servings=2, prep_time=5, cook_time=10,
            steps=["Étape 1"], owner=self.owner,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=1, unit="g")
        self.url = reverse("recipe-detail", args=[self.recipe.pk])
        self.valid_payload = {
            "name": "Recette modifiée",
            "description": "Nouvelle description.",
            "servings": 4,
            "prep_time": 10,
            "cook_time": 20,
            "steps": ["Étape A", "Étape B"],
            "ingredients": [{"name": "ail", "quantity": "2", "unit": "gousse(s)"}],
        }

    def test_owner_can_put(self):
        response = self.client.put(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Recette modifiée")
        self.assertTrue(response.data["is_owner"])

    def test_owner_can_patch(self):
        response = self.client.patch(self.url, {"name": "Nouveau nom"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Nouveau nom")

    def test_patch_without_ingredients_preserves_existing(self):
        response = self.client.patch(self.url, {"name": "Patch sans ingrédients"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["ingredients"]), 1)

    def test_non_owner_put_returns_403(self):
        self.client.force_login(self.other)
        response = self.client.put(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_owner_patch_returns_403(self):
        self.client.force_login(self.other)
        response = self.client.patch(self.url, {"name": "Hack"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_put_returns_403(self):
        self.client.logout()
        response = self.client.put(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_invalid_payload_returns_400(self):
        payload = {**self.valid_payload, "ingredients": []}
        response = self.client.put(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RecipeDeleteViewTest(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="testpass123")
        self.other = User.objects.create_user(username="other", password="testpass123")
        self.client.force_login(self.owner)
        ail = Ingredient.objects.create(name="ail")
        self.recipe = Recipe.objects.create(
            name="Recette à supprimer", description="", servings=2, prep_time=5, cook_time=10,
            steps=["Étape 1"], owner=self.owner,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=1, unit="g")
        self.url = reverse("recipe-detail", args=[self.recipe.pk])

    def test_owner_can_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Recipe.objects.filter(pk=self.recipe.pk).exists())

    def test_non_owner_delete_returns_403(self):
        self.client.force_login(self.other)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Recipe.objects.filter(pk=self.recipe.pk).exists())

    def test_unauthenticated_delete_returns_403(self):
        self.client.logout()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_removes_from_meal_plans(self):
        meal_plan = MealPlan.objects.create(user=self.owner)
        MealPlanRecipe.objects.create(meal_plan=meal_plan, recipe=self.recipe)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MealPlanRecipe.objects.filter(meal_plan=meal_plan, recipe=self.recipe).exists())

    def test_orphan_recipe_nobody_can_write(self):
        self.recipe.owner = None
        self.recipe.save()
        response = self.client.put(self.url, {
            "name": "X", "description": "", "servings": 1,
            "prep_time": 1, "cook_time": 1, "steps": ["X"],
            "ingredients": [{"name": "ail", "quantity": "1", "unit": "g"}],
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class MealPlanServingsTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="servings_user", password="testpass123")
        self.client.force_login(self.user)
        ail = Ingredient.objects.create(name="ail_s")
        self.recipe = Recipe.objects.create(
            name="Recette Servings", description="", servings=4,
            prep_time=5, cook_time=10, steps=["Étape 1"], owner=self.user,
        )
        RecipeIngredient.objects.create(recipe=self.recipe, ingredient=ail, quantity=2, unit="gousse(s)")
        self.add_url = reverse("meal-plan-recipe", args=[self.recipe.pk])

    def test_response_shape(self):
        response = self.client.get(reverse("meal-plan"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("entries", response.data)
        self.assertIsInstance(response.data["entries"], list)

    def test_add_recipe_default_servings(self):
        response = self.client.post(self.add_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entry = response.data["entries"][0]
        self.assertEqual(entry["recipe_id"], self.recipe.pk)
        self.assertEqual(entry["servings"], self.recipe.servings)
        self.assertEqual(entry["recipe_base_servings"], self.recipe.servings)

    def test_add_recipe_custom_servings(self):
        response = self.client.post(self.add_url, {"servings": 6}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["entries"][0]["servings"], 6)

    def test_add_recipe_servings_min_validation(self):
        response = self.client.post(self.add_url, {"servings": 0}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_idempotent_no_overwrite(self):
        self.client.post(self.add_url, {"servings": 6}, format="json")
        # Re-POST sans servings → ne doit pas écraser
        response = self.client.post(self.add_url)
        self.assertEqual(response.data["entries"][0]["servings"], 6)

    def test_add_idempotent_with_servings_overwrites(self):
        self.client.post(self.add_url, {"servings": 6}, format="json")
        response = self.client.post(self.add_url, {"servings": 8}, format="json")
        self.assertEqual(response.data["entries"][0]["servings"], 8)

    def test_patch_servings(self):
        self.client.post(self.add_url)
        response = self.client.patch(self.add_url, {"servings": 8}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["entries"][0]["servings"], 8)

    def test_patch_recipe_not_in_plan(self):
        response = self.client.patch(self.add_url, {"servings": 8}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_servings_invalid(self):
        self.client.post(self.add_url)
        response = self.client.patch(self.add_url, {"servings": 0}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
