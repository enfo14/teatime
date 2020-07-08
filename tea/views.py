from rest_framework.viewsets import ModelViewSet

from tea.models import Member
from tea.serializers import MemberSerializer


class MemberViewSet(ModelViewSet):
    """
    A viewset for viewing and editing members
    """

    serializer_class = MemberSerializer
    queryset = Member.objects.all()


class TeaView:
    pass


class HistoryView:
    pass


class CoffeeView:
    pass
