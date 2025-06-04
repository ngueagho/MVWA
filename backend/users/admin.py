# =====================================================
# backend/users/admin.py
# =====================================================
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Address, Wishlist, CustomerService

# Étendre l'admin User existant
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profil'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'gender', 'newsletter_subscription', 'created_at']
    list_filter = ['gender', 'newsletter_subscription', 'email_notifications', 'preferred_language']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'address_type', 'city', 'country', 'is_default_shipping', 'is_default_billing']
    list_filter = ['address_type', 'country', 'is_default_shipping', 'is_default_billing']
    search_fields = ['user__username', 'first_name', 'last_name', 'city', 'postal_code']
    readonly_fields = ['created_at']

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_filter = ['created_at', 'product__category']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['created_at']

@admin.register(CustomerService)
class CustomerServiceAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'user', 'subject', 'status', 'priority', 'assigned_to', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'assigned_to']
    search_fields = ['ticket_number', 'user__username', 'subject']
    readonly_fields = ['ticket_number', 'created_at', 'updated_at']
    
    def save_model(self, request, obj, form, change):
        if not obj.ticket_number:
            import uuid
            obj.ticket_number = f"CS{uuid.uuid4().hex[:6].upper()}"
        super().save_model(request, obj, form, change)