from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredient, MealPlan, Recipe
from .permissions import IsOwnerOrReadOnly
from .serializers import RecipeCreateSerializer, RecipeDetailSerializer, RecipeListSerializer
from .units import UNITS


class RecipeListView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return RecipeCreateSerializer
        return RecipeListSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save(owner=request.user)
        return Response(
            RecipeDetailSerializer(recipe, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.prefetch_related("recipe_ingredients__ingredient")
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return RecipeCreateSerializer
        return RecipeDetailSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()
        return Response(RecipeDetailSerializer(recipe, context={"request": request}).data)


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
