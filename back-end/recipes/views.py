from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredient, MealPlan, Recipe
from .serializers import RecipeCreateSerializer, RecipeDetailSerializer, RecipeListSerializer
from .units import UNITS


class RecipeListView(ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeListSerializer

    def post(self, request):
        serializer = RecipeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()
        return Response(RecipeDetailSerializer(recipe).data, status=status.HTTP_201_CREATED)


class RecipeDetailView(RetrieveAPIView):
    queryset = Recipe.objects.prefetch_related("recipe_ingredients__ingredient")
    serializer_class = RecipeDetailSerializer


class UnitListView(APIView):
    def get(self, request):
        return Response(UNITS)


class IngredientListView(APIView):
    def get(self, request):
        names = Ingredient.objects.values_list("name", flat=True).order_by("name")
        return Response(list(names))


def _meal_plan_response(meal_plan):
    return Response({"recipe_ids": list(meal_plan.recipes.values_list("id", flat=True))})


class MealPlanView(APIView):
    def get(self, request):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        return _meal_plan_response(meal_plan)

    def delete(self, request):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        meal_plan.recipes.clear()
        return _meal_plan_response(meal_plan)


class MealPlanRecipeView(APIView):
    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recette introuvable."}, status=status.HTTP_404_NOT_FOUND)
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        meal_plan.recipes.add(recipe)
        return _meal_plan_response(meal_plan)

    def delete(self, request, pk):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        meal_plan.recipes.remove(pk)
        return _meal_plan_response(meal_plan)
