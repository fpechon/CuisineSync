from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": {"code": "missing_credentials", "message": "Username et password requis."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {"error": {"code": "invalid_credentials", "message": "Identifiants incorrects."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    login(request, user)
    return Response({"id": user.id, "username": user.username})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def me_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": {"code": "not_authenticated", "message": "Non connecté."}},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return Response({"id": request.user.id, "username": request.user.username})
