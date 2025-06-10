// app/dashboard/page.tsx - DASHBOARD UTILISATEUR PERSONNALISÉ
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    loyaltyPoints: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadUserData()
    loadDashboardData()
    updateTime()
    
    // Mettre à jour l'heure chaque minute
    const timeInterval = setInterval(updateTime, 60000)
    return () => clearInterval(timeInterval)
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
      return
    }
  }

  const updateTime = () => {
    const now = new Date()
    const hours = now.getHours()
    let greeting = 'Bonne journée'
    
    if (hours >= 5 && hours < 12) {
      greeting = 'Bonjour'
    } else if (hours >= 12 && hours < 17) {
      greeting = 'Bon après-midi'
    } else if (hours >= 17 && hours < 22) {
      greeting = 'Bonsoir'
    } else {
      greeting = 'Bonne nuit'
    }
    
    setCurrentTime(greeting)
  }

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Charger les statistiques utilisateur
      const mockStats = {
        totalOrders: Math.floor(Math.random() * 15) + 1,
        totalSpent: Math.floor(Math.random() * 500000) + 50000,
        wishlistItems: Math.floor(Math.random() * 10) + 2,
        loyaltyPoints: Math.floor(Math.random() * 2000) + 100
      }
      setStats(mockStats)

      // Charger les commandes récentes
      const mockRecentOrders = [
        {
          id: 'UT-12345678',
          date: '2024-01-15',
          status: 'completed',
          total: 156200,
          items: 2,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
        },
        {
          id: 'UT-12345679',
          date: '2024-01-10',
          status: 'shipped',
          total: 98400,
          items: 1,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
        }
      ]
      setRecentOrders(mockRecentOrders)

      // Charger les recommandations
      const mockRecommendations = [
        {
          id: 1,
          name: 'Hoodie Premium Urban',
          price: 89500,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          discount: 20
        },
        {
          id: 2,
          name: 'Jean Slim Designer',
          price: 78700,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          discount: 15
        },
        {
          id: 3,
          name: 'Sneakers Limited',
          price: 125000,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
          discount: 25
        },
        {
          id: 4,
          name: 'Casquette Premium',
          price: 45000,
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
          discount: 10
        }
      ]
      setRecommendations(mockRecommendations)
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price.toLocaleString(),
      image: product.image
    }
    
    const existingItem = existingCart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...cartItem, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success(`${product.name} ajouté au panier !`)
  }

  const addToWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      dateAdded: new Date().toISOString(),
      inStock: true,
      category: 'Mode',
      brand: 'UrbanTendance'
    }
    
    const existingItem = existingWishlist.find(item => item.id === product.id)
    
    if (!existingItem) {
      existingWishlist.push(wishlistItem)
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist))
      toast.success(`${product.name} ajouté à votre wishlist !`)
    } else {
      toast.info('Ce produit est déjà dans votre wishlist')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Livrée'
      case 'shipped': return 'Expédiée'
      case 'pending': return 'En cours'
      default: return 'Inconnu'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête personnalisé */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {currentTime}, {user?.username || 'Utilisateur'} ! 👋
                </h1>
                <p className="text-xl opacity-90">
                  Bienvenue sur votre espace personnel UrbanTendance
                </p>
                <p className="text-lg opacity-75 mt-2">
                  Découvrez vos dernières activités et nos recommandations personnalisées
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Niveau</p>
                  <p className="text-2xl font-bold">VIP Gold</p>
                  <p className="text-sm opacity-75">{stats.loyaltyPoints} points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Voir toutes →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dépenses</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(stats.totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">FCFA cette année</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wishlist</p>
                <p className="text-3xl font-bold text-pink-600">{stats.wishlistItems}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
            <Link href="/wishlist" className="text-sm text-pink-600 hover:text-pink-800 mt-2 inline-block">
              Voir ma liste →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points fidélité</p>
                <p className="text-3xl font-bold text-purple-600">{stats.loyaltyPoints}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Prochaine récompense à 2500 pts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commandes récentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
                <Link href="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir tout →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-gray-500 mb-4">Aucune commande récente</p>
                  <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Commencer mes achats
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={order.image}
                            alt="Produit"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items} article{order.items > 1 ? 's' : ''} • {new Date(order.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="font-bold text-gray-900 mt-1">{formatPrice(order.total)} FCFA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  <span className="font-medium text-blue-700">Mon panier</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl">📦</span>
                  <span className="font-medium text-green-700">Mes commandes</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <span className="text-2xl">❤️</span>
                  <span className="font-medium text-pink-700">Ma wishlist</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl">👤</span>
                  <span className="font-medium text-purple-700">Mon profil</span>
                </Link>
              </div>
            </div>

            {/* Notification promotionnelle */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">🔥 Offre spéciale !</h3>
              <p className="text-sm mb-4 opacity-90">
                Profitez de -30% sur votre prochaine commande avec le code WELCOME30
              </p>
              <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                Utiliser maintenant
              </button>
            </div>
          </div>
        </div>

        {/* Recommandations personnalisées */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">✨ Recommandé pour vous</h2>
            <Link href="/nouveautes" className="text-blue-600 hover:text-blue-800 font-medium">
              Voir plus →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {product.discount > 0 && (
                  <div className="absolute z-10 top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{product.discount}%
                  </div>
                )}
                
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mb-4">{formatPrice(product.price)} FCFA</p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Ajouter au panier
                    </button>
                    <button
                      onClick={() => addToWishlist(product)}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      ❤️ Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message de bienvenue pour les nouveaux utilisateurs */}
        {stats.totalOrders === 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Bienvenue chez UrbanTendance !</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Vous êtes nouveau ici ? Découvrez notre collection exclusive de mode urbaine haut de gamme 
              et profitez de votre code de bienvenue pour votre première commande !
            </p>
            <div className="space-x-4">
              <Link
                href="/"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Explorer les collections
              </Link>
              <Link
                href="/nouveautes"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium inline-block"
              >
                Voir les nouveautés
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}