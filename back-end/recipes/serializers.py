from django.db import transaction
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
    owner_username = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ["id", "name", "description", "servings", "prep_time", "cook_time", "owner_username", "is_owner"]

    def get_owner_username(self, obj):
        return obj.owner.username if obj.owner else None

    def get_is_owner(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or obj.owner is None:
            return False
        return obj.owner == request.user


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(source="recipe_ingredients", many=True)
    owner_username = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            "id", "name", "description", "servings", "prep_time", "cook_time",
            "steps", "ingredients", "owner_username", "is_owner",
        ]

    def get_owner_username(self, obj):
        return obj.owner.username if obj.owner else None

    def get_is_owner(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or obj.owner is None:
            return False
        return obj.owner == request.user


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
        names = [i["name"].strip().lower() for i in value]
        if len(names) != len(set(names)):
            raise serializers.ValidationError("La recette contient des ingrédients en double.")
        return value

    def validate_steps(self, value):
        if not value:
            raise serializers.ValidationError("La recette doit avoir au moins une étape.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients")
        recipe = Recipe.objects.create(**validated_data)
        self._save_ingredients(recipe, ingredients_data)
        return recipe

    @transaction.atomic
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("ingredients", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if ingredients_data is not None:
            instance.recipe_ingredients.all().delete()
            self._save_ingredients(instance, ingredients_data)
        return instance

    def _save_ingredients(self, recipe, ingredients_data):
        for ing in ingredients_data:
            name = ing["name"].strip()
            ingredient, _ = Ingredient.objects.get_or_create(
                name__iexact=name,
                defaults={"name": name},
            )
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=ing["quantity"],
                unit=ing["unit"],
            )
