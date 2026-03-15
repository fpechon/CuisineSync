from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.users.urls")),
    path("api/v1/", include("apps.recipes.urls")),
    path("api/v1/", include("apps.inventory.urls")),
    path("api/v1/", include("apps.shopping.urls")),
]
