from django.urls import include, path
from rest_framework.routers import SimpleRouter

from tea import views

router = SimpleRouter()
router.register(r"members", views.MemberViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("tea/", views.TeaView.as_view(), name="tea"),
    path("history/", views.HistoryView.as_view(), name="history"),
    path("coffee/", views.CoffeeView.as_view(), name="coffee"),
]
