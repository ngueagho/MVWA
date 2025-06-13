// app/admin/page.tsx - DASHBOARD ADMIN PROTÉGÉ PAR ADMINGUARD
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import AdminGuard from '../../components/AdminGuard'  // ✅ NOUVEAU IMPORT

export default function AdminPage() {
  // ✅ SUPPRESSION DES ÉTATS DE VÉRIFICATION ADMIN
  // const [isAdmin, setIsAdmin] = useState(false) - Plus besoin
  // const [loading, setLoading] = useState(true) - Plus besoin
  
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
    // ✅ SUPPRESSION DE checkAdminAccess() - Maintenant géré par AdminGuard
    loadDashboardData()
    
    // Charger les données utilisateur depuis localStorage
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Erreur parsing user data:', error)
      }
    }
  }, [])

  // ✅ SUPPRESSION COMPLÈTE DE checkAdminAccess() - Plus nécessaire

  const loadDashboardData = async () => {
    try {
      // FAILLE: Pas de vérification token côté serveur
      const token = localStorage.getItem('auth_token')
      
      console.log('DEBUG: Chargement données dashboard admin...')
      
      // Charger les produits pour les stats
      const adminProducts = localStorage.getItem('admin_products')
      let productsCount = 0
      if (adminProducts) {
        const productsData = JSON.parse(adminProducts)
        setProducts(productsData)
        productsCount = productsData.length
      }
      
      // Simulation d'appels API vulnérables
      try {
        const usersResponse = await fetch('http://62.171.146.0:8000/api/users/admin/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
          setStats(prev => ({ ...prev, totalUsers: usersData.length }))
          console.log('DEBUG: Données utilisateurs chargées depuis API')
        } else {
          console.log('DEBUG: API users indisponible, utilisation données simulées')
        }
      } catch (apiError) {
        console.log('DEBUG: Backend indisponible, utilisation données simulées')
      }

      // Données simulées pour la démo
      setStats({
        totalUsers: 156,
        totalOrders: 1247,
        totalProducts: productsCount,
        totalRevenue: 3567890,
        todayOrders: 23
      })

      setOrders([
        { id: 'UT-12345678', customer: 'Jean Dupont', amount: 89500, status: 'completed', date: '2024-01-15' },
        { id: 'UT-12345679', customer: 'Marie Martin', amount: 156200, status: 'pending', date: '2024-01-15' },
        { id: 'UT-12345680', customer: 'Paul Bernard', amount: 67800, status: 'shipped', date: '2024-01-14' }
      ])

    } catch (error) {
      console.error('Erreur chargement données:', error)
    }
  }

  // FAILLE: Fonction de suppression d'utilisateur sans confirmation
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://62.171.146.0:8000/api/users/admin/users/${userId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        toast.success('Utilisateur supprimé')
        loadDashboardData()
      } else {
        toast.error('Erreur suppression utilisateur')
      }
    } catch (error) {
      toast.error('Erreur suppression')
      console.error('Delete user error:', error)
    }
  }

  // FAILLE: Requête SQL injectable via l'interface admin
  const searchUsers = async (query) => {
    try {
      const token = localStorage.getItem('auth_token')
      // FAILLE: Paramètre de recherche non échappé
      const response = await fetch(`http://62.171.146.0:8000/api/users/admin/users/search/?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const results = await response.json()
        setUsers(results)
      }
    } catch (error) {
      console.error('Erreur recherche:', error)
    }
  }

  // FAILLE: Suppression de produit sans vérification
  const deleteProduct = async (productId) => {
    try {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
      localStorage.setItem('public_products', JSON.stringify(updatedProducts))
      toast.success('Produit supprimé sans vérification!')
      loadDashboardData()
    } catch (error) {
      toast.error('Erreur suppression produit')
    }
  }

  // FAILLE: Commande SQL directe exposée
  const executeSQL = async (sqlQuery) => {
    try {
      const token = localStorage.getItem('auth_token')
      // FAILLE: Exécution directe de SQL sans validation
      const response = await fetch('http://62.171.146.0:8000/api/users/admin/execute-sql/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sqlQuery })
      })
      
      if (response.ok) {
        const result = await response.json()
        toast.success('Requête SQL exécutée!')
        console.log('Résultat SQL:', result)
      } else {
        toast.error('Erreur exécution SQL')
      }
    } catch (error) {
      toast.error('Erreur exécution SQL')
      console.error('SQL execution error:', error)
    }
  }

  // ✅ SUPPRESSION DES VÉRIFICATIONS DE LOADING ET isAdmin
  // Maintenant géré par AdminGuard

  return (
    <AdminGuard>  {/* ✅ WRAPPER DE PROTECTION ADMIN */}
      <div className="min-h-screen bg-gray-50 pt-20">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Dashboard Administrateur </h1>
            <p className="text-gray-600">
              Bienvenue {user?.username}, panneau de contrôle UrbanTendance
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                🛡️ Admin  Vérifié
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Permissions: is_staff={user?.is_staff ? '✅' : '❌'} | is_superuser={user?.is_superuser ? '✅' : '❌'} | role={user?.role}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {['dashboard', 'users', 'orders', 'products', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Commandes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Produits</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Revenus</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Actions Rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link
                    href="/admin/products"
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors text-center group"
                  >
                    <div className="text-2xl mb-2">🛍️</div>
                    <div className="text-sm font-medium text-blue-700">Gérer les Produits</div>
                    <div className="text-xs text-blue-600 mt-1">{stats.totalProducts} produits</div>
                  </Link>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors text-center cursor-pointer">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="text-sm font-medium text-green-700">Traiter Commandes</div>
                    <div className="text-xs text-green-600 mt-1">{stats.totalOrders} commandes</div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors text-center cursor-pointer">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-purple-700">Analytics</div>
                    <div className="text-xs text-purple-600 mt-1">Voir les stats</div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors text-center cursor-pointer">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm font-medium text-yellow-700">Paramètres</div>
                    <div className="text-xs text-yellow-600 mt-1">Configuration</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Commandes Récentes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.amount.toLocaleString()} FCFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Gestion des Utilisateurs</h3>
                  <div className="flex space-x-3">
                    {/* FAILLE: Recherche SQL injectable */}
                    <input
                      type="text"
                      placeholder="Rechercher ..."
                      onChange={(e) => searchUsers(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Nouvel utilisateur
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: 1, username: 'admin', email: 'admin@urbantendance.com', role: 'Admin', status: 'active' },
                    { id: 2, username: 'test', email: 'test@urbantendance.com', role: 'User', status: 'active' },
                    { id: 3, username: 'jean.dupont', email: 'jean@email.com', role: 'User', status: 'active' }
                  ].map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                        <button  
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">🛍️ Gestion des Produits</h3>
                  <Link
                    href="/admin/products"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                  >
                    Interface Complète
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          📦
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category} • {product.price.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'En stock' : 'Rupture'}
                        </span>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📦</div>
                      <p>Aucun produit créé</p>
                      <Link
                        href="/admin/products"
                        className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        Créer votre premier produit →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FAILLE: Section d'outils admin dangereux */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">⚠️ Outils Administrateur Dangereux</h3>
                
                <div className="space-y-4">




                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800">🔓 Informations</h4>
                    <div className="mt-2 text-sm text-gray-600 space-y-1 font-mono">
                      <p><strong>🔑 Auth Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('auth_token')?.substring(0, 30) + '...' : 'N/A'}</p>
                      <p><strong>👤 User Data:</strong> {JSON.stringify(user)}</p>
                      <p><strong>🌐 User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
                      <p><strong>📍 Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                      <p><strong>🕐 Session Start:</strong> {new Date().toISOString()}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800">🔧 Informations Système</h4>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p><strong>Django Version:</strong> 4.2.0</p>
                      <p><strong>Database:</strong> postgres 3.42.0</p>
                      <p><strong>Debug Mode:</strong> <span className="text-red-600 font-bold">ENABLED</span></p>
                      <p><strong>Error Reporting:</strong> <span className="text-red-600 font-bold">ALL</span></p>
                    </div>
                  </div>

             
                </div>
              </div>
            </div>
          )}

          {/* FAILLE: Informations de debug toujours exposées */}

        </div>
      </div>
    </AdminGuard>  
  )
}