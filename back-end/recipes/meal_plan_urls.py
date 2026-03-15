from django.urls import path

from . import views

urlpatterns = [
    path("", views.MealPlanView.as_view(), name="meal-plan"),
    path("recipes/<int:pk>/", views.MealPlanRecipeView.as_view(), name="meal-plan-recipe"),
]
