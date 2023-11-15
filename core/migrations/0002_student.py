# Generated by Django 4.2.5 on 2023-11-07 09:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("studnet_id", models.BigIntegerField()),
                ("name_on_id_card", models.CharField(max_length=100)),
                ("username", models.CharField(max_length=100)),
                ("email_address", models.CharField(max_length=100)),
                ("password", models.CharField(max_length=100)),
            ],
        ),
    ]
