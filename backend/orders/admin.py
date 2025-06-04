# =====================================================
# backend/orders/admin.py
# =====================================================
from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Coupon, CouponUsage, ShippingMethod

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['total_price']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_price', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'total_price']
    inlines = [CartItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'size', 'color', 'total_price']
    list_filter = ['size', 'color', 'added_at']
    search_fields = ['cart__user__username', 'product__name']
    readonly_fields = ['total_price', 'added_at']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_status', 'total_amount', 'created_at']
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__username', 'user__email', 'tracking_number']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('order_number', 'user', 'status', 'payment_status')
        }),
        ('Montants', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'discount_amount', 'total_amount')
        }),
        ('Livraison', {
            'fields': ('shipping_method', 'tracking_number', 'estimated_delivery', 'delivered_at')
        }),
        ('Paiement', {
            'fields': ('payment_method', 'payment_id')
        }),
        ('Adresses', {
            'fields': ('shipping_address', 'billing_address'),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['size', 'color']
    search_fields = ['order__order_number', 'product_name', 'product_sku']

class CouponUsageInline(admin.TabularInline):
    model = CouponUsage
    extra = 0
    readonly_fields = ['used_at']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'discount_type', 'discount_value', 'used_count', 'usage_limit', 'is_active', 'valid_from', 'valid_to']
    list_filter = ['discount_type', 'is_active', 'valid_from', 'valid_to']
    search_fields = ['code', 'name']
    readonly_fields = ['used_count', 'created_at', 'is_valid']
    inlines = [CouponUsageInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('code', 'name', 'description')
        }),
        ('Réduction', {
            'fields': ('discount_type', 'discount_value', 'minimum_amount', 'maximum_discount')
        }),
        ('Limites d\'utilisation', {
            'fields': ('usage_limit', 'used_count', 'user_limit')
        }),
        ('Validité', {
            'fields': ('is_active', 'valid_from', 'valid_to', 'is_valid')
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )

@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'discount_amount', 'used_at']
    list_filter = ['used_at', 'coupon__discount_type']
    search_fields = ['coupon__code', 'user__username', 'order__order_number']
    readonly_fields = ['used_at']

@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'estimated_days', 'free_shipping_threshold', 'is_active']
    list_filter = ['is_active', 'estimated_days']
    search_fields = ['name']
