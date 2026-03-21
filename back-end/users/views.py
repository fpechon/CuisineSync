from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"error": {"code": "missing_credentials", "message": "Username et password requis."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        request,
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if user is None:
        return Response(
            {"error": {"code": "invalid_credentials", "message": "Identifiants incorrects."}},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def me_view(request):
    # AllowAny intentionnel : cet endpoint sert aussi à distribuer le cookie CSRF
    # aux clients non authentifiés. On retourne 401 (pas 403) pour que le front
    # sache qu'il doit rediriger vers /login.
    if not request.user.is_authenticated:
        return Response(
            {"error": {"code": "not_authenticated", "message": "Non connecté."}},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return Response(UserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"error": {"code": "validation_error", "message": serializer.errors}},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = serializer.save()
    login(request, user)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
