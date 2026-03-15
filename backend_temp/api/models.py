"""
Django models for COGNITIVE Brain Tumor Detection
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model"""
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Fix reverse accessor conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='api_user_set',
        related_query_name='api_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='api_user_set',
        related_query_name='api_user',
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.email


class Patient(models.Model):
    """Patient model"""
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'patients'
    
    def __str__(self):
        return self.name


class Scan(models.Model):
    """MRI Scan model"""
    TUMOR_TYPES = [
        ('glioma', 'Glioma'),
        ('meningioma', 'Meningioma'),
        ('pituitary', 'Pituitary'),
        ('no_tumor', 'No Tumor'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='scans')
    image_path = models.CharField(max_length=500)
    prediction = models.CharField(max_length=50, choices=TUMOR_TYPES)
    confidence = models.FloatField()
    heatmap_path = models.CharField(max_length=500, null=True, blank=True)
    report_path = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'scans'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Scan {self.id} - {self.patient.name}"
