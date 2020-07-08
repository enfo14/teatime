from uuid import uuid4
from django.db import models


class UserLevel(models.IntegerChoices):
    JUNIOR = 1
    MID = 2
    SENIOR = 3


class Member(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    level = models.IntegerField(choices=UserLevel.choices, default=UserLevel.JUNIOR)
    deleted = models.BooleanField(default=False)


class TeaRound(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    made_by = models.ForeignKey(to=Member, on_delete=models.PROTECT)
    voided = models.BooleanField(default=False)
