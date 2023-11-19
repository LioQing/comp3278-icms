# Generated by Django 4.2.5 on 2023-11-18 17:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import core.models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_coursefile_last_edit_coursehyperlink_last_edit_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FaceLabel',
            fields=[
                ('label_id', models.PositiveIntegerField(blank=True, null=True, unique=True)),
                ('student', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='face_label', serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Face',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to=core.models.Face.get_image_path)),
                ('label', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='faces', to='core.facelabel')),
            ],
            options={
                'unique_together': {('label', 'id')},
            },
        ),
    ]
