import pytest
from rest_framework.test import APIRequestFactory

from tea import models


@pytest.fixture
def api_rf():
    return APIRequestFactory()


@pytest.fixture
def make_member():
    def _make(**kwargs):
        kwargs.setdefault("first_name", "Foo")
        kwargs.setdefault("last_name", "Bar")
        kwargs.setdefault("level", models.UserLevel.JUNIOR)
        member, created = models.Member.objects.get_or_create(**kwargs)
        return member

    return _make


@pytest.fixture
def make_tea(make_member):
    def _make(**kwargs):
        kwargs.setdefault("made_by", make_member())
        tea = models.TeaRound.objects.create(**kwargs)
        return tea

    return _make
