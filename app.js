
// ============================================
// 5. INSTRUCTIONS D'INSTALLATION
// ============================================

/*
📁 STRUCTURE DES FICHIERS À CRÉER/MODIFIER:

frontend/
├── utils/
│   └── api.js (NOUVEAU)
├── components/
│   └── ApiStatus.tsx (NOUVEAU)
├── app/
│   ├── login/
│   │   └── page.tsx (MODIFIÉ)
│   ├── admin/
│   │   ├── page.tsx (MODIFIÉ)
│   │   └── products/
│   │       └── page.tsx (MODIFIÉ)

🚀 ÉTAPES D'INSTALLATION:

1. Créer le dossier utils/ et le fichier api.js
2. Créer le composant ApiStatus.tsx dans components/
3. Remplacer les 3 fichiers modifiés
4. Démarrer l'API Django (port 8000)
5. Démarrer le frontend Next.js (port 3000)

✅ FONCTIONNALITÉS AJOUTÉES:

🔗 Connexion API Django automatique
📊 Données réelles depuis la base Django
🚨 Vulnérabilités fonctionnelles (SQL injection, etc.)
💾 Fallback localStorage si API déconnectée
📈 Indicateur de statut API en temps réel
🧪 Création de données de test via API
🔄 Synchronisation bidirectionnelle

⚠️ VULNÉRABILITÉS ACTIVES:

✓ Injection SQL via recherche utilisateurs
✓ Exécution SQL directe depuis l'interface
✓ Exposition d'informations sensibles
✓ Suppression sans confirmation
✓ Contrôle d'accès faible
✓ Debug info exposé
✓ CSRF désactivé côté API

🎯 COMPTES DE TEST:
- admin / admin123 (administrateur)
- test / test123 (utilisateur)

L'interface s'adapte automatiquement selon que l'API Django
est connectée ou non, offrant une expérience complète
dans les deux cas!
*/

