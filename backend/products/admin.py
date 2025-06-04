# =====================================================
# backend/products/admin.py
# =====================================================
from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_price', 'stock', 'is_featured', 'is_active', 'created_at']
    list_filter = ['category', 'is_featured', 'is_active', 'is_new', 'is_sale', 'brand']
    search_fields = ['name', 'description', 'brand']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'average_rating', 'reviews_count']
    filter_horizontal = []
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'slug', 'description', 'category', 'brand')
        }),
        ('Prix et stock', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Variantes', {
            'fields': ('sizes', 'colors', 'weight', 'material')
        }),
        ('Statuts', {
            'fields': ('is_active', 'is_featured', 'is_new', 'is_sale')
        }),
        ('Soins', {
            'fields': ('care_instructions',),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at', 'average_rating', 'reviews_count'),
            'classes': ('collapse',)
        })
    )

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'order']
    list_filter = ['is_primary', 'product__category']
    search_fields = ['product__name', 'alt_text']
    list_editable = ['is_primary', 'order']

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'size', 'color', 'sku', 'stock', 'price_adjustment']
    list_filter = ['size', 'color', 'product__category']
    search_fields = ['product__name', 'sku']
    list_editable = ['stock', 'price_adjustment']
