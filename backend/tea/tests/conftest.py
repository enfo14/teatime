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


@pytest.fixture
def make_all_members(make_member):
    make_member(first_name="John", last_name="Watson", level=models.UserLevel.JUNIOR)
    make_member(first_name="Bruce", last_name="Wayne", level=models.UserLevel.JUNIOR)
    make_member(first_name="James", last_name="Bond", level=models.UserLevel.JUNIOR)
    make_member(first_name="Sherlock", last_name="Holmes", level=models.UserLevel.MID)
    make_member(first_name="Thomas", last_name="Magnum", level=models.UserLevel.MID)
    make_member(first_name="Harry", last_name="Hole", level=models.UserLevel.MID)
    make_member(first_name="Jane", last_name="Marple", level=models.UserLevel.SENIOR)
    make_member(first_name="Hercule", last_name="Poirot", level=models.UserLevel.SENIOR)
    make_member(first_name="Dirk", last_name="Gently", level=models.UserLevel.SENIOR)
