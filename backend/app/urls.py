"""URL Configuration"""
from django.contrib import admin
from django.urls import include, path

from tea.urls import urlpatterns as tea_urls

urlpatterns = [path("admin/", admin.site.urls), path("", include(tea_urls))]
