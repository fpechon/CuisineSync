from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Recipe
from .serializers import RecipeDetailSerializer, RecipeListSerializer


class RecipeListView(ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeListSerializer


class RecipeDetailView(RetrieveAPIView):
    queryset = Recipe.objects.prefetch_related("recipe_ingredients__ingredient")
    serializer_class = RecipeDetailSerializer
