from uuid import uuid4

import pytest

from tea.models import UserLevel, Member, TeaRound
from tea.views import CoffeeView, HistoryView, MemberViewSet, TeaView


@pytest.mark.django_db
class TestMemberViewSet:
    def test_list_members(self, rf, make_member):
        member = make_member()
        res = MemberViewSet().list(rf.get("/members"))
        assert res.status_code == 200
        assert len(res.json) == 1
        assert res.json[0]["id"] == member.id

    def test_list_filters_by_level(self, rf, make_member):
        req = rf.get("/members", {"level": "mid"})
        make_member()
        mid = make_member(first_name="James", last_name="Bond", level=UserLevel.MID)
        make_member(first_name="John", last_name="Doe", level=UserLevel.SENIOR)
        res = MemberViewSet().list(req)
        assert res.status_code == 200
        assert len(res.json) == 1
        assert res.json[0]["id"] == mid.id

    def test_list_handles_level_invalid(self, rf):
        req = rf.get("/members", {"level": "lead"})
        res = MemberViewSet().list(req)
        assert res.status_code == 400

    def test_create_expects_request_body(self, rf):
        req = rf.post("/members")
        res = MemberViewSet().create(req)
        assert res.status_code == 400

    def test_create_new_member(self, rf):
        members_before = Member.objects.count()
        req = rf.post("/members", {"first_name": "John", "last_name": "Doe", "level": "senior"})
        res = MemberViewSet().create(req)
        assert res.status_code == 201
        assert Member.objects.count() == members_before + 1

    def test_retrieve_handles_bad_uuid(self, rf):
        uuid = uuid4()
        req = rf.get(f"/members/{uuid}")
        res = MemberViewSet().retrieve(req, uuid)
        assert res.status_code == 404

    def test_retrieve_member(self, rf, make_member):
        member = make_member()
        req = rf.get(f"/members/{member.id}")
        res = MemberViewSet().retrieve(req, member.id)
        assert res.status_code == 200
        assert res.json["id"] == member.id

    def test_update_handles_bad_uuid(self, rf):
        uuid = uuid4()
        req = rf.put(f"/members/{uuid}", {"first_name": "James", "last_name": "Bond", "level": "mid"})
        res = MemberViewSet().update(req, uuid)
        assert res.status_code == 404

    def test_update_expects_all_fields(self, rf, make_member):
        member = make_member()
        req = rf.put(f"/members/{member.id}", {"first_name": "James", "level": "mid"})
        res = MemberViewSet().update(req, member.id)
        assert res.status_code == 400

    def test_update_handles_level_invalid(self, rf, make_member):
        member = make_member()
        req = rf.put(f"/members/{member.id}", {"first_name": "James", "last_name": "Bond", "level": "lead"})
        res = MemberViewSet().update(req, member.id)
        assert res.status_code == 400

    def test_update_member(self, rf, make_member):
        member = make_member()
        req = rf.put(f"/members/{member.id}", {"first_name": "James", "last_name": "Bond", "level": "mid"})
        res = MemberViewSet().update(req, member.id)
        assert res.status_code == 200
        assert res.json["first_name"] == "James"
        assert res.json["last_name"] == "Bond"

    def test_partial_update_handles_bad_uuid(self, rf):
        uuid = uuid4()
        req = rf.patch(f"/members/{uuid}", {"last_name": "Bond"})
        res = MemberViewSet().partial_update(req, uuid)
        assert res.status_code == 404

    def test_partial_update_handles_level_invalid(self, rf, make_member):
        member = make_member()
        req = rf.patch(f"/members/{member.id}", {"level": "lead"})
        res = MemberViewSet().partial_update(req, member.id)
        assert res.status_code == 400

    def test_partial_update(self, rf, make_member):
        member = make_member()
        req = rf.patch(f"/members/{member.id}", {"last_name": "Bond"})
        res = MemberViewSet().partial_update(req, member.id)
        assert res.status_code == 200
        assert res.json["first_name"] == "Foo"
        assert res.json["last_name"] == "Bond"

    def test_delete_handles_bad_uuid(self, rf):
        uuid = uuid4()
        req = rf.delete(f"/members/{uuid}")
        res = MemberViewSet().delete(req, uuid)
        assert res.status_code == 404

    def test_delete_clears_personal_data(self, rf, make_member):
        """The 'delete' action should clear the firstName and lastName fields"""
        member = make_member()
        req = rf.delete(f"/members/{member.id}")
        res = MemberViewSet().delete(req, member.id)
        assert res.status_code == 204
        member.refresh_from_db()
        assert member.first_name == ""
        assert member.last_name == ""
        assert member.deleted


@pytest.mark.django_db
class TestTeaView:
    def test_get_empty_if_no_tea_round_in_progress(self, rf):
        req = rf.get("/tea")
        res = TeaView().get(req)
        assert res.status_code == 200
        assert res.json == []

    def test_get_shows_current_tea_round(self, rf, make_tea):
        make_tea()
        req = rf.get("/tea")
        res = TeaView().get(req)
        assert res.status_code == 200
        assert len(res.json) == 1

    def test_post_creates_new_tea_round(self, rf):
        tea_rounds_before = TeaRound.objects.count()
        req = rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 201
        assert TeaRound.objects.count() == tea_rounds_before + 1

    def test_post_cooldown(self, rf, make_tea):
        make_tea()
        req = rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 425

    def test_post_cooldown_ignored_if_last_round_voided(self, rf, make_tea):
        make_tea(voided=True)
        tea_rounds_before = TeaRound.objects.count()
        req = rf.post("/tea")
        res = TeaView().post(req)
        assert res.status_code == 201
        assert TeaRound.objects.count() == tea_rounds_before + 1

    def test_delete_voids_current_tea_round(self, rf, make_tea):
        tea = make_tea()
        assert not tea.voided
        req = rf.delete("/tea")
        res = TeaView().delete(req)
        assert res.status_code == 204
        tea.refresh_from_db()
        assert tea.voided

    def test_delete_handles_no_current_tea_round(self, rf):
        req = rf.delete("/tea")
        res = TeaView().delete(req)
        assert res.status_code == 404


@pytest.mark.django_db
class TestHistoryView:
    def test_get_shows_list_of_tea_rounds(self, rf, make_member, make_tea):
        junior = make_member()
        mid = make_member(first_name="James", last_name="Bond", level=UserLevel.MID)
        senior = make_member(first_name="John", last_name="Doe", level=UserLevel.SENIOR)
        make_tea(made_by=junior)
        make_tea(made_by=mid)
        make_tea(made_by=junior)
        make_tea(made_by=senior)
        make_tea(made_by=mid)
        make_tea(made_by=junior)

        req = rf.get("/history")
        res = HistoryView().get(req)
        assert res.status_code == 200
        assert len(res.json) == 6


class TestCoffeeView:
    def test_coffee_cannot_be_requested(self, rf):
        req = rf.post("/coffee")
        res = CoffeeView().get(req)
        assert res.status_code == 418
