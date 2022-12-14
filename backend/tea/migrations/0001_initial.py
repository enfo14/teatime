# Generated by Django 3.0.8 on 2020-07-08 10:09

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Member",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("first_name", models.CharField(max_length=64)),
                ("last_name", models.CharField(max_length=64)),
                ("level", models.IntegerField(choices=[(1, "Junior"), (2, "Mid"), (3, "Senior")], default=1)),
                ("deleted", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="TeaRound",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                ("voided", models.BooleanField(default=False)),
                ("made_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="tea.Member")),
            ],
        ),
    ]
