from django.contrib import admin

from .models import Ingredient, MealPlan, Recipe, RecipeIngredient


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1
    autocomplete_fields = ["ingredient"]


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ["name", "servings", "prep_time", "cook_time"]
    search_fields = ["name"]
    inlines = [RecipeIngredientInline]


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ["user", "recipe_count"]

    def recipe_count(self, obj):
        return obj.recipes.count()
    recipe_count.short_description = "Nombre de recettes"
