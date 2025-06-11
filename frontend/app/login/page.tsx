// app/login/page.tsx - MIS À JOUR pour l'authentification Django Admin
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'
import urbanAPI from '../../utils/api'
import ApiStatus from '../../components/ApiStatus'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [userAgent, setUserAgent] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [apiStatus, setApiStatus] = useState({ connected: false, testing: true })
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    checkApiConnection()
    
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent)
      
      // Vérifier si l'utilisateur est déjà connecté
      if (urbanAPI.isAuthenticated()) {
        toast.info('Déjà connecté, redirection...')
        router.push(urbanAPI.isAdmin() ? '/admin' : '/dashboard')
      }
    }
  }, [router])

  const checkApiConnection = async () => {
    try {
      const status = await urbanAPI.getApiStatus()
      setApiStatus({ connected: status.connected, testing: false })
      
      if (status.connected) {
        toast.success('🟢 API Django connectée!')
      } else {
        toast.error('🔴 API Django déconnectée - Mode fallback')
      }
    } catch (error) {
      setApiStatus({ connected: false, testing: false })
      toast.error('❌ Impossible de vérifier l\'API Django')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAttemptCount(prev => prev + 1)

    try {
      console.log('🔐 Tentative de connexion Django Admin:', formData.username)
      
      // TENTATIVE 1: Authentification Django Admin via API
      const response = await urbanAPI.loginDjangoAdmin(formData)
      
      if (response.success) {
        const user = response.user
        toast.success(`🎉 Connexion Django Admin réussie! Bienvenue ${user.username}`)
        
        // Log des informations d'authentification (FAILLE: logs sensibles)
        console.log('🔑 Authentification réussie:', {
          user: user,
          permissions: response.permissions,
          token: response.token
        })

        // Redirection selon le type d'utilisateur
        setTimeout(() => {
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect')
          
          if (user.is_staff || user.is_superuser) {
            // Admin/Staff -> Redirection vers l'admin
            router.push(redirectUrl?.startsWith('/admin') ? redirectUrl : '/admin')
            toast.success('🔧 Accès administrateur accordé')
          } else {
            // Utilisateur normal -> Dashboard
            router.push(redirectUrl?.startsWith('/') && !redirectUrl.startsWith('/admin') ? redirectUrl : '/dashboard')
          }
        }, 1500)
      } else {
        throw new Error(response.error || 'Échec authentification Django')
      }
      
    } catch (djangoError) {
      console.warn('⚠️ Échec authentification Django:', djangoError.message)
      
      // FALLBACK: Authentification locale pour compatibilité
      if (attemptCount <= 3) {
        await tryFallbackAuth()
      } else {
        toast.error(`❌ Trop de tentatives (${attemptCount}). Réessayez plus tard.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const tryFallbackAuth = async () => {
    // FAILLE: Comptes de test en dur
    const fallbackAccounts = {
      // Comptes Django simulés
      'djangoadmin': { password: 'django123admin', role: 'superuser' },
      'admintest': { password: 'admin123test', role: 'staff' },
      'usertest': { password: 'user123test', role: 'user' },
      
      // Anciens comptes de test
      'admin': { password: 'admin123', role: 'admin' },
      'test': { password: 'test123', role: 'user' }
    }

    const account = fallbackAccounts[formData.username]
    
    if (account && account.password === formData.password) {
      // Créer un utilisateur simulé
      const mockUser = {
        id: Object.keys(fallbackAccounts).indexOf(formData.username) + 1,
        username: formData.username,
        email: `${formData.username}@urbantendance.com`,
        first_name: formData.username.charAt(0).toUpperCase() + formData.username.slice(1),
        last_name: 'Test',
        is_staff: ['admin', 'admintest', 'djangoadmin'].includes(formData.username),
        is_superuser: ['admin', 'djangoadmin'].includes(formData.username),
        role: account.role,
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
      
      // Stocker en localStorage pour simulation
      localStorage.setItem('auth_token', `fallback_${formData.username}_${Date.now()}`)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      localStorage.setItem('user_permissions', JSON.stringify({
        can_add_users: mockUser.is_superuser,
        can_delete_users: mockUser.is_superuser,
        can_execute_sql: mockUser.is_superuser,
        can_view_logs: mockUser.is_staff,
        can_manage_products: mockUser.is_staff,
        can_manage_orders: mockUser.is_staff
      }))
      
      toast.success(`🔄 Connexion fallback réussie! (${account.role})`)
      
      setTimeout(() => {
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect')
        if (mockUser.is_staff && (!redirectUrl || redirectUrl.includes('admin'))) {
          router.push('/admin')
        } else {
          router.push(redirectUrl?.startsWith('/') ? redirectUrl : '/dashboard')
        }
      }, 1000)
    } else {
      toast.error('❌ Identifiants incorrects')
      
      // FAILLE: Information leakage sur les tentatives
      if (attemptCount >= 3) {
        toast.error(`🚨 ${attemptCount} tentatives échouées pour ${formData.username}`)
        console.warn('🚨 FAILLE: Tentatives multiples détectées:', {
          username: formData.username,
          attempts: attemptCount,
          userAgent: userAgent,
          timestamp: new Date().toISOString(),
          ip: 'IP_LEAKED_IN_LOGS'
        })
      }
    }
  }

  // Fonction pour pré-remplir les identifiants de test
  const fillTestCredentials = (username: string, password: string) => {
    setFormData({ username, password })
    toast.info(`🧪 Identifiants de test: ${username}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <ApiStatus />
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            🔐 Connexion Django Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Utilisez vos identifiants Django superuser
          </p>
          <div className="mt-2 text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              apiStatus.testing 
                ? 'bg-yellow-100 text-yellow-800' 
                : apiStatus.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {apiStatus.testing ? '🔄 Test API...' : apiStatus.connected ? '🟢 Django API' : '🔴 Mode Fallback'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur Django
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="djangoadmin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe Django
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="django123admin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="/admin" className="font-medium text-blue-600 hover:text-blue-500">
                  Admin Django classique →
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authentification Django...
                  </div>
                ) : (
                  '🔑 Se connecter avec Django'
                )}
              </button>
            </div>
          </form>

          {/* Comptes de test Django */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-3">🔐 Comptes Django Admin de test</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => fillTestCredentials('djangoadmin', 'django123admin')}
                className="text-left p-2 bg-green-100 hover:bg-green-200 rounded text-xs transition-colors"
              >
                <div className="font-medium text-green-800">🚀 djangoadmin / django123admin</div>
                <div className="text-green-600">Superuser - Accès complet Django</div>
              </button>
              
              <button
                onClick={() => fillTestCredentials('admintest', 'admin123test')}
                className="text-left p-2 bg-blue-100 hover:bg-blue-200 rounded text-xs transition-colors"
              >
                <div className="font-medium text-blue-800">⚙️ admintest / admin123test</div>
                <div className="text-blue-600">Staff - Accès admin limité</div>
              </button>
              
              <button
                onClick={() => fillTestCredentials('usertest', 'user123test')}
                className="text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
              >
                <div className="font-medium text-gray-800">👤 usertest / user123test</div>
                <div className="text-gray-600">Utilisateur - Accès utilisateur</div>
              </button>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              <p><strong>💡 Info:</strong> Ces comptes utilisent l'authentification Django réelle.</p>
              <p>Si l'API Django est déconnectée, le système utilise un mode fallback.</p>
            </div>
          </div>

          {/* Comptes de test fallback */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">🔄 Comptes fallback (si API déconnectée)</h4>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Test:</strong> test / test123</p>
              <p className="text-blue-500 italic">Mode localStorage si Django inaccessible</p>
            </div>
          </div>

          {/* FAILLE: Informations de debug exposées */}
          {isClient && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
              <p><strong>🔍 Debug Info (FAILLE):</strong></p>
              <p>Tentatives: {attemptCount}</p>
              <p>User Agent: {userAgent.substring(0, 50)}...</p>
              <p>API Status: {apiStatus.connected ? 'Connected' : 'Disconnected'}</p>
              <p>Session ID: sess_{Math.random().toString(36).substring(7)}</p>
              <p>IP simulée: 192.168.1.{Math.floor(Math.random() * 255)}</p>
            </div>
          )}

          {/* Liens vers d'autres pages */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Pas encore de compte?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Créer un compte
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/" className="font-medium text-gray-600 hover:text-gray-500">
                ← Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}