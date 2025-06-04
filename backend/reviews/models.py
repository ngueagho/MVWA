# =====================================================
# backend/reviews/models.py
# =====================================================
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Note de 1 à 5 étoiles"
    )
    title = models.CharField(max_length=200)
    comment = models.TextField()  # FAILLE: Pas de validation XSS - VOLONTAIRE
    
    # Détails de l'expérience
    would_recommend = models.BooleanField(default=True)
    verified_purchase = models.BooleanField(default=False)
    
    # Évaluations détaillées
    quality_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], 
        null=True, blank=True
    )
    value_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], 
        null=True, blank=True
    )
    comfort_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], 
        null=True, blank=True
    )
    
    # Métadonnées
    is_approved = models.BooleanField(default=True)  # FAILLE: Auto-approuvé sans modération
    helpful_votes = models.PositiveIntegerField(default=0)
    total_votes = models.PositiveIntegerField(default=0)
    reported_count = models.PositiveIntegerField(default=0)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Avis de {self.user.username} pour {self.product.name} - {self.rating}★"
    
    @property
    def helpfulness_ratio(self):
        if self.total_votes > 0:
            return round((self.helpful_votes / self.total_votes) * 100, 1)
        return 0

class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='reviews/')
    alt_text = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image pour avis de {self.review.user.username}"

class ReviewVote(models.Model):
    VOTE_CHOICES = [
        ('helpful', 'Utile'),
        ('not_helpful', 'Pas utile'),
    ]
    
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote = models.CharField(max_length=15, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('review', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.vote} pour avis #{self.review.id}"

class ReviewReport(models.Model):
    REPORT_REASONS = [
        ('spam', 'Spam'),
        ('inappropriate', 'Contenu inapproprié'),
        ('fake', 'Faux avis'),
        ('offensive', 'Contenu offensant'),
        ('other', 'Autre'),
    ]
    
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reports')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(max_length=20, choices=REPORT_REASONS)
    comment = models.TextField(blank=True)  # FAILLE: Pas de validation XSS
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('review', 'user')
    
    def __str__(self):
        return f"Signalement de {self.user.username} - {self.reason}"