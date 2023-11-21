# Generated by Django 4.2.5 on 2023-11-17 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_course_name_alter_coursefile_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='session_type',
            field=models.CharField(choices=[('LEC', 'Lecture'), ('TUT', 'Tutorial'), ('LAB', 'Lab'), ('OTH', 'Other')], max_length=3),
        ),
    ]