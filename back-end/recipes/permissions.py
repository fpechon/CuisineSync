from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Lecture autorisée pour tout utilisateur authentifié.
    Écriture (PUT, PATCH, DELETE) réservée au propriétaire de la recette.
    Une recette sans propriétaire (owner=None) est non modifiable par personne.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner is not None and obj.owner == request.user
