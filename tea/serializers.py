from rest_framework import serializers

from tea.models import Member, UserLevel, TeaRound


class MemberSerializer(serializers.ModelSerializer):
    level = serializers.ChoiceField(choices=UserLevel.choices)

    class Meta:
        model = Member
        fields = ["id", "first_name", "last_name", "level"]


class TeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeaRound
        fields = ["timestamp", "made_by", "voided"]
        depth = 1
