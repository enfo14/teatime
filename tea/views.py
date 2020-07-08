from rest_framework import exceptions
from rest_framework.viewsets import ModelViewSet

from tea.models import Member, UserLevel
from tea.serializers import MemberSerializer


class MemberViewSet(ModelViewSet):
    """
    A viewset for viewing and editing members
    """

    serializer_class = MemberSerializer
    queryset = Member.objects.all()

    def filter_queryset(self, queryset):
        queryset = queryset.filter(deleted=False)
        level = self.request.query_params.get("level", None)
        if level:
            if level not in [str(value) for value, _ in UserLevel.choices]:
                raise exceptions.ValidationError(f"User level must be one of: {UserLevel.choices}")
            queryset = queryset.filter(level=int(level))
        return queryset

    def perform_destroy(self, instance):
        instance.first_name = ""
        instance.last_name = ""
        instance.deleted = True
        instance.save()


class TeaView:
    pass


class HistoryView:
    pass


class CoffeeView:
    pass
