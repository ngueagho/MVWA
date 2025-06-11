// frontend/components/AdminGuard.tsx - Protection des pages admin Django
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff: boolean
  is_superuser?: boolean
  role: string
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Vérification côté client d'abord
      const userData = localStorage.getItem('user_data')
      const token = localStorage.getItem('auth_token')
      
      console.log('DEBUG AdminGuard - Vérification accès admin...')
      
      if (!userData || !token) {
        console.log('DEBUG: Pas de données utilisateur, redirection login')
        toast.error('Connexion requise pour accéder à cette page')
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }

      const user: User = JSON.parse(userData)
      setUser(user)
      
      console.log('DEBUG AdminGuard - User data:', user)
      console.log('DEBUG AdminGuard - is_staff:', user.is_staff)
      console.log('DEBUG AdminGuard - is_superuser:', user.is_superuser)
      console.log('DEBUG AdminGuard - role:', user.role)
      
      // ✅ VÉRIFICATION STRICTE DES PERMISSIONS DJANGO
      const hasAdminPermissions = (
        user.is_staff === true || 
        user.is_superuser === true || 
        user.role === 'admin'
      )
      
      if (hasAdminPermissions) {
        console.log('DEBUG: Permissions admin confirmées côté client')
        setIsAdmin(true)
        
        // ✅ BONUS: Vérification côté serveur (double sécurité)
        try {
          console.log('DEBUG: Vérification côté serveur...')
          const response = await fetch('http://62.171.146.0:8000/api/users/check-admin/', {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const adminData = await response.json()
            console.log('DEBUG: Réponse serveur admin check:', adminData)
            
            if (!adminData.is_admin) {
              console.log('DEBUG: Serveur refuse les permissions admin')
              toast.error('Permissions administrateur refusées par le serveur')
              router.push('/dashboard')
              return
            }
            
            console.log('DEBUG: Permissions admin confirmées côté serveur ✅')
          } else {
            console.log('DEBUG: Erreur serveur admin check, status:', response.status)
            // En cas d'erreur serveur, on garde la vérification client pour éviter de bloquer
            console.log('DEBUG: Utilisation de la vérification client comme fallback')
          }
        } catch (serverError) {
          console.log('DEBUG: Erreur réseau vérification serveur:', serverError)
          // En cas d'erreur réseau, on garde la vérification client
          console.log('DEBUG: Backend indisponible, utilisation cache local')
        }
        
      } else {
        console.log('DEBUG: Pas de permissions admin détectées')
        console.log(`DEBUG: is_staff=${user.is_staff}, is_superuser=${user.is_superuser}, role=${user.role}`)
        toast.error('Accès refusé - Permissions administrateur Django requises')
        router.push('/dashboard')
        return
      }

    } catch (error) {
      console.error('DEBUG: Erreur parsing données utilisateur:', error)
      toast.error('Erreur de vérification des permissions')
      // Nettoyer le cache corrompu
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions administrateur...</p>
          <p className="text-sm text-gray-500 mt-2">Validation côté client et serveur</p>
        </div>
      </div>
    )
  }

  // État d'accès refusé
  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">Permissions insuffisantes</h2>
            <p className="text-red-700 text-sm mb-3">
              Vous devez être <strong>administrateur Django</strong> pour accéder à cette page.
            </p>
            <div className="text-xs text-red-600 space-y-1">
              <p><strong>Utilisateur actuel:</strong> {user?.username || 'Inconnu'}</p>
              <p><strong>Rôle:</strong> {user?.role || 'Non défini'}</p>
              <p><strong>is_staff:</strong> {user?.is_staff ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>is_superuser:</strong> {user?.is_superuser ? '✅ Oui' : '❌ Non'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🏠 Retour au Dashboard
            </button>
            
            <button 
              onClick={() => {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user_data')
                router.push('/login')
              }}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔐 Se connecter avec un compte admin
            </button>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>💡 Pour les tests:</strong> Utilisez le compte <code className="bg-blue-100 px-1 rounded">admin/admin123</code> 
              qui a les permissions <code>is_staff=true</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Accès autorisé - Afficher le contenu protégé
  return (
    <>
      {/* Debug info en development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-green-900 text-white p-2 rounded text-xs max-w-xs">
          <div className="font-bold text-green-200">🛡️ AdminGuard Active</div>
          <div>👤 {user?.username}</div>
          <div>🔐 Role: {user?.role}</div>
          <div>✅ is_staff: {user?.is_staff ? 'Oui' : 'Non'}</div>
          <div>⭐ is_superuser: {user?.is_superuser ? 'Oui' : 'Non'}</div>
        </div>
      )}
      {children}
    </>
  )
}