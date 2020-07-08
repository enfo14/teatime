import pytest

from tea.models import UserLevel
from tea.views import MemberViewSet


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

    def test_list_handles_level_invalid(self, rf, make_member):
        req = rf.get("/members", {"level": "lead"})
        res = MemberViewSet().list(req)
        assert res.status_code == 400

    def test_create_expects_request_body(self):
        pass

    def test_create_new_member(self):
        pass

    def test_retrieve_handles_bad_uuid(self):
        pass

    def test_retrieve_member(self):
        pass

    def test_update_handles_bad_uuid(self):
        pass

    def test_update_expects_all_fields(self):
        pass

    def test_update_handles_level_invalid(self):
        pass

    def test_update_member(self):
        pass

    def test_partial_update_handles_bad_uuid(self):
        pass

    def test_partial_update_expects_all_fields(self):
        pass

    def test_partial_update_handles_level_invalid(self):
        pass

    def test_partial_update(self):
        pass

    def test_delete_handles_bad_uuid(self):
        pass

    def test_delete_clears_personal_data(self):
        """The 'delete' action should clear the firstName and lastName fields"""

    def test_delete_sets_deleted_field(self):
        """The 'delete' action should set the boolean 'deleted' as True"""


@pytest.mark.django_db
class TestTeaView:
    def test_get_shows_current_tea_round(self):
        pass

    def test_get_empty_if_no_tea_round_in_progress(self):
        pass

    def test_post_creates_new_tea_round(self):
        pass

    def test_post_cooldown(self):
        pass

    def test_delete_voids_current_tea_round(self):
        pass

    def test_delete_handles_no_current_tea_round(self):
        pass


@pytest.mark.django_db
class TestHistoryView:
    def test_get_shows_list_of_tea_rounds(self):
        pass


class TestCoffeeView:
    def test_coffee_cannot_be_requested(self):
        pass
