
# ==========================================
// 5. FRONTEND - Nouveau composant de protection (frontend/components/AdminGuard.tsx)
# ==========================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Vérification côté client d'abord
      const userData = localStorage.getItem('user_data')
      const token = localStorage.getItem('auth_token')
      
      if (!userData || !token) {
        console.log('DEBUG: Pas de données utilisateur, redirection login')
        router.push('/login?redirect=' + window.location.pathname)
        return
      }

      const user = JSON.parse(userData)
      setUser(user)
      
      console.log('DEBUG AdminGuard - User data:', user)
      
      // Vérification permissions Django
      if (user.is_staff === true || user.is_superuser === true || user.role === 'admin') {
        console.log('DEBUG: Permissions admin confirmées')
        setIsAdmin(true)
      } else {
        console.log('DEBUG: Pas de permissions admin')
        toast.error('Accès refusé - Permissions administrateur requises')
        router.push('/dashboard')
        return
      }

      // ✅ BONUS: Vérification côté serveur (optionnel)
      try {
        const response = await fetch('http://localhost:8000/api/users/check-admin/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const adminData = await response.json()
          console.log('DEBUG: Vérification serveur:', adminData)
          if (!adminData.is_admin) {
            toast.error('Permissions insuffisantes côté serveur')
            router.push('/dashboard')
            return
          }
        }
      } catch (error) {
        console.log('DEBUG: Vérification serveur échouée, utilisation cache local')
        // En cas d'erreur serveur, on garde la vérification client
      }

    } catch (error) {
      console.error('Erreur vérification admin:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions admin...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">Vous devez être administrateur Django pour accéder à cette page</p>
          <p className="text-sm text-gray-500">Utilisateur actuel: {user?.username} (role: {user?.role})</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}





# ==========================================
// 6. FRONTEND - Modifier la page admin (frontend/app/admin/page.tsx)
// Remplacer tout le début jusqu'à "return (" par :
# ==========================================

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import AdminGuard from '../../components/AdminGuard'  // ✅ NOUVEAU

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    todayOrders: 0
  })
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // ✅ Supprimer checkAdminAccess() car maintenant géré par AdminGuard
    loadDashboardData()
    
    // Charger les données utilisateur depuis localStorage
    const userData = localStorage.getItem('user_data')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // ... garder le reste des fonctions identiques ...

  return (
    <AdminGuard>  {/* ✅ WRAPPER DE PROTECTION */}
      <div className="min-h-screen bg-gray-50 pt-20">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Dashboard Administrateur Django</h1>
            <p className="text-gray-600">
              Bienvenue {user?.username}, panneau de contrôle UrbanTendance 
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Admin Django ✓
              </span>
            </p>
          </div>

          {/* ✅ Garder tout le reste identique... */}

# ==========================================
// 7. INSTRUCTIONS DE DÉPLOIEMENT
# ==========================================

// ✅ ÉTAPES À SUIVRE :

// 1. Modifier backend/users/views.py avec les nouvelles fonctions
// 2. Ajouter l'URL dans backend/users/urls.py  
// 3. Créer le fichier frontend/components/AdminGuard.tsx
// 4. Modifier frontend/app/login/page.tsx (juste la partie handleSubmit)
// 5. Modifier frontend/app/admin/page.tsx (ajouter AdminGuard wrapper)

// ✅ TESTS :
// - Connectez-vous avec "admin/admin123" → devrait aller sur /admin
// - Connectez-vous avec "test/test123" → devrait aller sur /dashboard  
// - Testez l'accès direct à /admin sans être admin

// ✅ CRÉATION D'UN VRAI ADMIN DJANGO :
// Dans votre backend, faites :
// python manage.py shell
// from django.contrib.auth.models import User
// admin_user = User.objects.get(username='admin')
// admin_user.is_staff = True
// admin_user.is_superuser = True  
// admin_user.save()

console.log("✅ Solution complète pour la protection admin Django !")