"""
Django admin configuration
"""
from django.contrib import admin
from .models import User, Patient, Scan


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_active', 'created_at']
    search_fields = ['email', 'name']
    list_filter = ['is_active', 'created_at']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['name', 'age', 'gender', 'created_at']
    search_fields = ['name']
    list_filter = ['gender', 'created_at']


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'prediction', 'confidence', 'created_at']
    search_fields = ['patient__name']
    list_filter = ['prediction', 'created_at']
