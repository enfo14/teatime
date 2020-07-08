from django.contrib import admin

from tea.models import Member, TeaRound


class MemberAdmin(admin.ModelAdmin):
    model = Member


class TeaRoundAdmin(admin.ModelAdmin):
    model = TeaRound


admin.site.register(Member, MemberAdmin)
admin.site.register(TeaRound, TeaRoundAdmin)
