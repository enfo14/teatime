from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserLevel(models.IntegerChoices):
    JUNIOR = 1
    MID = 2
    SENIOR = 3


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.IntegerField(choices=UserLevel.choices, default=UserLevel.JUNIOR)


class TeaRound(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    made_by = models.ForeignKey(to=User, on_delete=models.PROTECT)
    voided = models.BooleanField(default=False)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()
