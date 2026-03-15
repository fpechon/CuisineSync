from rest_framework import serializers

from .models import Ingredient, Recipe, RecipeIngredient
from .units import UNITS


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "name"]


class RecipeIngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="ingredient.name")

    class Meta:
        model = RecipeIngredient
        fields = ["id", "name", "quantity", "unit"]


class RecipeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["id", "name", "description", "servings", "prep_time", "cook_time"]


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(source="recipe_ingredients", many=True)

    class Meta:
        model = Recipe
        fields = ["id", "name", "description", "servings", "prep_time", "cook_time", "steps", "ingredients"]


class RecipeIngredientWriteSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    quantity = serializers.DecimalField(max_digits=8, decimal_places=2)
    unit = serializers.ChoiceField(choices=UNITS)


class RecipeCreateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientWriteSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ["id", "name", "description", "servings", "prep_time", "cook_time", "steps", "ingredients"]

    def validate_ingredients(self, value):
        if not value:
            raise serializers.ValidationError("La recette doit avoir au moins un ingrédient.")
        return value

    def validate_steps(self, value):
        if not value:
            raise serializers.ValidationError("La recette doit avoir au moins une étape.")
        return value

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients")
        recipe = Recipe.objects.create(**validated_data)
        for ing in ingredients_data:
            name = ing["name"].strip()
            try:
                ingredient = Ingredient.objects.get(name__iexact=name)
            except Ingredient.DoesNotExist:
                ingredient = Ingredient.objects.create(name=name)
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=ing["quantity"],
                unit=ing["unit"],
            )
        return recipe
