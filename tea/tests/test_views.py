import json
from uuid import uuid4

import pytest

from tea.models import UserLevel, Member, TeaRound
from tea.views import CoffeeView, HistoryView, MemberViewSet, TeaView


@pytest.mark.django_db
class TestMemberViewSet:
    def test_list_members(self, api_rf, make_member):
        member = make_member()
        res = MemberViewSet.as_view({"get": "list"})(api_rf.get("/members"))
        res.render()
        body = json.loads(res.content)
        assert res.status_code == 200
        assert len(body) == 1
        assert body[0]["id"] == str(member.id)

    def test_list_filters_by_level(self, api_rf, make_member):
        req = api_rf.get("/members", {"level": "mid"})
        make_member()
        mid = make_member(first_name="James", last_name="Bond", level=UserLevel.MID)
        make_member(first_name="John", last_name="Doe", level=UserLevel.SENIOR)
        res = MemberViewSet.as_view({"get": "list"})(req)
        res.render()
        body = json.loads(res.content)
        assert res.status_code == 200
        assert len(body) == 1
        assert body[0]["id"] == str(mid.id)

    def test_list_handles_level_invalid(self, api_rf):
        req = api_rf.get("/members", {"level": "lead"})
        res = MemberViewSet.as_view({"get": "list"})(req)
        assert res.status_code == 400

    def test_create_expects_request_body(self, api_rf):
        req = api_rf.post("/members")
        res = MemberViewSet.as_view({"post": "create"})(req)
        assert res.status_code == 400

    def test_create_new_member(self, api_rf):
        members_before = Member.objects.count()
        req = api_rf.post("/members", {"first_name": "John", "last_name": "Doe", "level": UserLevel.SENIOR})
        res = MemberViewSet.as_view({"post": "create"})(req)
        assert res.status_code == 201
        assert Member.objects.count() == members_before + 1

    def test_retrieve_handles_bad_uuid(self, api_rf):
        uuid = uuid4()
        req = api_rf.get(f"/members/{uuid}")
        res = MemberViewSet.as_view({"get": "retrieve"})(req, pk=uuid)
        assert res.status_code == 404

    def test_retrieve_member(self, api_rf, make_member):
        member = make_member()
        req = api_rf.get(f"/members/{member.id}")
        res = MemberViewSet.as_view({"get": "retrieve"})(req, pk=member.id)
        res.render()
        body = json.loads(res.content)
        assert res.status_code == 200
        assert body["id"] == str(member.id)

    def test_update_handles_bad_uuid(self, api_rf):
        uuid = uuid4()
        req = api_rf.put(f"/members/{uuid}", {"first_name": "James", "last_name": "Bond", "level": UserLevel.MID})
        res = MemberViewSet.as_view({"put": "update"})(req, pk=uuid)
        assert res.status_code == 404

    def test_update_expects_all_fields(self, api_rf, make_member):
        member = make_member()
        req = api_rf.put(f"/members/{member.id}", {"first_name": "James", "level": UserLevel.MID})
        res = MemberViewSet.as_view({"put": "update"})(req, pk=member.id)
        assert res.status_code == 400

    def test_update_handles_level_invalid(self, api_rf, make_member):
        member = make_member()
        req = api_rf.put(f"/members/{member.id}", {"first_name": "James", "last_name": "Bond", "level": "Lead"})
        res = MemberViewSet.as_view({"put": "update"})(req, pk=member.id)
        assert res.status_code == 400

    def test_update_member(self, api_rf, make_member):
        member = make_member()
        req = api_rf.put(f"/members/{member.id}", {"first_name": "James", "last_name": "Bond", "level": UserLevel.MID})
        res = MemberViewSet.as_view({"put": "update"})(req, pk=member.id)
        res.render()
        body = json.loads(res.content)
        assert res.status_code == 200
        assert body["first_name"] == "James"
        assert body["last_name"] == "Bond"

    def test_partial_update_handles_bad_uuid(self, api_rf):
        uuid = uuid4()
        req = api_rf.patch(f"/members/{uuid}", {"last_name": "Bond"})
        res = MemberViewSet.as_view({"patch": "partial_update"})(req, pk=uuid)
        assert res.status_code == 404

    def test_partial_update_handles_level_invalid(self, api_rf, make_member):
        member = make_member()
        req = api_rf.patch(f"/members/{member.id}", {"level": "Lead"})
        res = MemberViewSet.as_view({"patch": "partial_update"})(req, pk=member.id)
        assert res.status_code == 400

    def test_partial_update(self, api_rf, make_member):
        member = make_member()
        req = api_rf.patch(f"/members/{member.id}", {"last_name": "Bond"})
        res = MemberViewSet.as_view({"patch": "partial_update"})(req, pk=member.id)
        res.render()
        body = json.loads(res.content)
        assert res.status_code == 200
        assert body["first_name"] == "Foo"
        assert body["last_name"] == "Bond"

    def test_delete_handles_bad_uuid(self, api_rf):
        uuid = uuid4()
        req = api_rf.delete(f"/members/{uuid}")
        res = MemberViewSet.as_view({"delete": "destroy"})(req, pk=uuid)
        assert res.status_code == 404

    def test_delete_clears_personal_data(self, api_rf, make_member):
        """The 'delete' action should clear the firstName and lastName fields"""
        member = make_member()
        req = api_rf.delete(f"/members/{member.id}")
        res = MemberViewSet.as_view({"delete": "destroy"})(req, pk=member.id)
        assert res.status_code == 204
        member.refresh_from_db()
        assert member.first_name == ""
        assert member.last_name == ""
        assert member.deleted


@pytest.mark.django_db
class TestTeaView:
    def test_get_empty_if_no_tea_round_in_progress(self, api_rf):
        req = api_rf.get("/tea")
        res = TeaView().get(req)
        assert res.status_code == 200
        assert res.json == []

    def test_get_shows_current_tea_round(self, api_rf, make_tea):
        make_tea()
        req = api_rf.get("/tea")
        res = TeaView().get(req)
        assert res.status_code == 200
        assert len(res.json) == 1

    def test_post_creates_new_tea_round(self, api_rf):
        tea_rounds_before = TeaRound.objects.count()
        req = api_rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 201
        assert TeaRound.objects.count() == tea_rounds_before + 1

    def test_post_cooldown(self, api_rf, make_tea):
        make_tea()
        req = api_rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 425

    def test_post_cooldown_ignored_if_last_round_voided(self, api_rf, make_tea):
        make_tea(voided=True)
        tea_rounds_before = TeaRound.objects.count()
        req = api_rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 201
        assert TeaRound.objects.count() == tea_rounds_before + 1

    def test_delete_voids_current_tea_round(self, api_rf, make_tea):
        tea = make_tea()
        assert not tea.voided
        req = api_rf.delete("/tea")
        res = TeaView().delete(req)
        assert res.status_code == 204
        tea.refresh_from_db()
        assert tea.voided

    def test_delete_handles_no_current_tea_round(self, api_rf):
        req = api_rf.delete("/tea")
        res = TeaView().delete(req)
        assert res.status_code == 404


@pytest.mark.django_db
class TestHistoryView:
    def test_get_shows_list_of_tea_rounds(self, api_rf, make_member, make_tea):
        junior = make_member()
        mid = make_member(first_name="James", last_name="Bond", level=UserLevel.MID)
        senior = make_member(first_name="John", last_name="Doe", level=UserLevel.SENIOR)
        make_tea(made_by=junior)
        make_tea(made_by=mid)
        make_tea(made_by=junior)
        make_tea(made_by=senior)
        make_tea(made_by=mid)
        make_tea(made_by=junior)

        req = api_rf.get("/history")
        res = HistoryView().get(req)
        assert res.status_code == 200
        assert len(res.json) == 6


class TestCoffeeView:
    def test_coffee_cannot_be_requested(self, api_rf):
        req = api_rf.post("/coffee")
        res = CoffeeView().get(req)
        assert res.status_code == 418
