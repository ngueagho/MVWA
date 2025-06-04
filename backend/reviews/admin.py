# =====================================================
# backend/reviews/admin.py
# =====================================================
from django.contrib import admin
from .models import Review, ReviewImage, ReviewVote, ReviewReport

class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'title', 'is_approved', 'verified_purchase', 'helpful_votes', 'created_at']
    list_filter = ['rating', 'is_approved', 'verified_purchase', 'would_recommend', 'created_at']
    search_fields = ['user__username', 'product__name', 'title', 'comment']
    readonly_fields = ['created_at', 'updated_at', 'helpful_votes', 'total_votes', 'helpfulness_ratio']
    inlines = [ReviewImageInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('user', 'product', 'order', 'title', 'comment')
        }),
        ('Évaluations', {
            'fields': ('rating', 'quality_rating', 'value_rating', 'comfort_rating')
        }),
        ('Statuts', {
            'fields': ('is_approved', 'verified_purchase', 'would_recommend')
        }),
        ('Votes et signalements', {
            'fields': ('helpful_votes', 'total_votes', 'helpfulness_ratio', 'reported_count'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['approve_reviews', 'disapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} avis approuvés.')
    approve_reviews.short_description = "Approuver les avis sélectionnés"
    
    def disapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} avis désapprouvés.')
    disapprove_reviews.short_description = "Désapprouver les avis sélectionnés"

@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ['review', 'alt_text', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['review__user__username', 'review__product__name', 'alt_text']
    readonly_fields = ['uploaded_at']

@admin.register(ReviewVote)
class ReviewVoteAdmin(admin.ModelAdmin):
    list_display = ['review', 'user', 'vote', 'created_at']
    list_filter = ['vote', 'created_at']
    search_fields = ['review__user__username', 'user__username']
    readonly_fields = ['created_at']

@admin.register(ReviewReport)
class ReviewReportAdmin(admin.ModelAdmin):
    list_display = ['review', 'user', 'reason', 'is_resolved', 'created_at']
    list_filter = ['reason', 'is_resolved', 'created_at']
    search_fields = ['review__user__username', 'user__username', 'comment']
    readonly_fields = ['created_at']
    
    actions = ['mark_resolved', 'mark_unresolved']
    
    def mark_resolved(self, request, queryset):
        updated = queryset.update(is_resolved=True)
        self.message_user(request, f'{updated} signalements marqués comme résolus.')
    mark_resolved.short_description = "Marquer comme résolu"
    
    def mark_unresolved(self, request, queryset):
        updated = queryset.update(is_resolved=False)
        self.message_user(request, f'{updated} signalements marqués comme non résolus.')
    mark_unresolved.short_description = "Marquer comme non résolu"

# Configuration générale de l'admin
admin.site.site_header = "UrbanTendance Administration"
admin.site.site_title = "UrbanTendance Admin"
admin.site.index_title = "Panneau d'administration"