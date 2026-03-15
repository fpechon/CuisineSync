from django.conf import settings
from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    servings = models.PositiveSmallIntegerField(default=4)
    prep_time = models.PositiveSmallIntegerField(help_text="En minutes")
    cook_time = models.PositiveSmallIntegerField(help_text="En minutes")
    steps = models.JSONField(default=list, help_text="Liste ordonnée des étapes de préparation")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="recipe_ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT, related_name="recipe_ingredients")
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=50)

    class Meta:
        ordering = ["ingredient__name"]
        unique_together = [("recipe", "ingredient")]

    def __str__(self):
        return f"{self.quantity} {self.unit} {self.ingredient.name}"


class MealPlan(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="meal_plan"
    )
    recipes = models.ManyToManyField(Recipe, blank=True, related_name="meal_plans")

    def __str__(self):
        return f"Panier de {self.user}"
