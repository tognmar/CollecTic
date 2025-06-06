# Generated by Django 5.1.7 on 2025-04-23 10:36

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserProfile', '0002_useraccount_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='useraccount',
            name='last_updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
