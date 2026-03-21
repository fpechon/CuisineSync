from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredient, MealPlan, MealPlanRecipe, Recipe
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    MealPlanRecipeAddSerializer,
    MealPlanRecipeUpdateSerializer,
    MealPlanSerializer,
    RecipeCreateSerializer,
    RecipeDetailSerializer,
    RecipeListSerializer,
)
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


def _meal_plan_response(meal_plan, status_code=status.HTTP_200_OK):
    obj = MealPlan.objects.prefetch_related("meal_plan_recipes__recipe").get(pk=meal_plan.pk)
    return Response(MealPlanSerializer(obj).data, status=status_code)


class MealPlanView(APIView):
    def get(self, request):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        return _meal_plan_response(meal_plan)

    def delete(self, request):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        MealPlanRecipe.objects.filter(meal_plan=meal_plan).delete()
        return _meal_plan_response(meal_plan)


class MealPlanRecipeView(APIView):
    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recette introuvable."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MealPlanRecipeAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        requested_servings = serializer.validated_data["servings"]

        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        entry, created = MealPlanRecipe.objects.get_or_create(
            meal_plan=meal_plan,
            recipe=recipe,
            defaults={"servings": requested_servings if requested_servings is not None else recipe.servings},
        )
        if not created and requested_servings is not None:
            entry.servings = requested_servings
            entry.save()
        return _meal_plan_response(meal_plan)

    def patch(self, request, pk):
        meal_plan = MealPlan.objects.filter(user=request.user).first()
        if not meal_plan:
            return Response({"detail": "Panier introuvable."}, status=status.HTTP_404_NOT_FOUND)
        try:
            entry = MealPlanRecipe.objects.get(meal_plan=meal_plan, recipe_id=pk)
        except MealPlanRecipe.DoesNotExist:
            return Response({"detail": "Recette absente du panier."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MealPlanRecipeUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry.servings = serializer.validated_data["servings"]
        entry.save()
        return _meal_plan_response(meal_plan)

    def delete(self, request, pk):
        meal_plan, _ = MealPlan.objects.get_or_create(user=request.user)
        MealPlanRecipe.objects.filter(meal_plan=meal_plan, recipe_id=pk).delete()
        return _meal_plan_response(meal_plan)
