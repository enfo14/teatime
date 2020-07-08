from datetime import datetime
from random import choices

from dateutil.relativedelta import relativedelta
import pytz
from rest_framework import exceptions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from tea.models import Member, TeaRound, UserLevel
from tea.serializers import MemberSerializer, TeaSerializer


class MemberViewSet(ModelViewSet):
    """
    A viewset for viewing and editing members
    """

    serializer_class = MemberSerializer
    queryset = Member.objects.all()

    def filter_queryset(self, queryset):
        """We filter out 'deleted' members, and we optionally filter by level"""
        queryset = queryset.filter(deleted=False)
        level = self.request.query_params.get("level", None)
        if level:
            if level not in [str(value) for value, _ in UserLevel.choices]:
                raise exceptions.ValidationError(f"User level must be one of: {UserLevel.choices}")
            queryset = queryset.filter(level=int(level))
        return queryset

    def perform_destroy(self, instance):
        """Instead of actually deleting the object, anonymise it and set it as 'deleted'"""
        instance.first_name = ""
        instance.last_name = ""
        instance.deleted = True
        instance.save()


class TeaView(APIView):
    """
    A view class to view and manage the round of tea
    """

    def _get_current_round(self):
        time_limit = datetime.now(pytz.utc) - relativedelta(minutes=30)
        queryset = TeaRound.objects.filter(voided=False, timestamp__gt=time_limit)
        return queryset.latest("timestamp") if queryset.exists() else None

    def get(self, request, *args, **kwargs):
        """Get the latest TeaRound if it was created within the last 30 minutes"""
        current_round = self._get_current_round()
        data = [TeaSerializer(current_round).data] if current_round else []
        return Response(data=data)

    def post(self, request, *args, **kwargs):
        """Request a new tea round"""
        current_round = self._get_current_round()
        if current_round:
            raise exceptions.ValidationError("Tea has already been requested")

        queryset = TeaRound.objects.filter(voided=False)
        latest = queryset.latest("timestamp") if queryset.exists() else None

        # If there is no pending tea round, create one
        member_queryset = Member.objects.filter(deleted=False)
        if latest:
            member_queryset = member_queryset.exclude(id=latest.made_by.id)
        if not member_queryset.exists():
            raise exceptions.NotFound("There are no available team members")

        member_weights = [1 / member.level for member in member_queryset]
        member_selected = choices(member_queryset, member_weights)[0]
        new_round = TeaRound.objects.create(made_by=member_selected)
        return Response(data=TeaSerializer(new_round).data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        """Void the current tea round"""
        current_round = self._get_current_round()
        if not current_round:
            raise exceptions.NotFound("There isn't a pending round of tea to void")
        current_round.voided = True
        current_round.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HistoryView(ListAPIView):
    queryset = TeaRound.objects.all()
    serializer_class = TeaSerializer


class CoffeeView(APIView):
    def post(self, request, *args, **kwargs):
        return Response(data="I can't make coffee.", status=status.HTTP_418_IM_A_TEAPOT)
