// app/wishlist/page.tsx - PAGE WISHLIST VULNÉRABLE
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [sortBy, setSortBy] = useState('recent')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadWishlist()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!token) {
      router.push('/login?redirect=/wishlist')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }

  // FAILLE: Chargement de la wishlist sans vérification serveur
  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // FAILLE: Endpoint potentiellement exposé
      const response = await fetch('http://62.171.146.0:8000/api/wishlist/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWishlist(data.items || [])
      } else {
        // Données simulées stockées localement
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        
        // Si pas de wishlist locale, utiliser des données de démo
        if (localWishlist.length === 0) {
          const mockWishlist = [
            {
              id: 1,
              name: 'Hoodie Premium Urban Black',
              price: 89500,
              originalPrice: 120000,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
              category: 'Sweats',
              brand: 'UrbanTendance',
              inStock: true,
              dateAdded: '2024-01-15T10:30:00Z',
              discount: 25
            },
            {
              id: 2,
              name: 'Jean Slim Fit Designer',
              price: 78700,
              originalPrice: 98000,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
              category: 'Jeans',
              brand: 'Premium Denim',
              inStock: true,
              dateAdded: '2024-01-12T14:20:00Z',
              discount: 20
            },
            {
              id: 3,
              name: 'Sneakers Limited Edition',
              price: 156000,
              originalPrice: 156000,
              image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
              category: 'Chaussures',
              brand: 'Elite Sports',
              inStock: false,
              dateAdded: '2024-01-08T09:15:00Z',
              discount: 0
            },
            {
              id: 4,
              name: 'Veste Bomber Vintage',
              price: 125000,
              originalPrice: 180000,
              image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
              category: 'Vestes',
              brand: 'Retro Style',
              inStock: true,
              dateAdded: '2024-01-05T16:45:00Z',
              discount: 30
            },
            {
              id: 5,
              name: 'Montre Smart Premium',
              price: 89000,
              originalPrice: 89000,
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
              category: 'Accessoires',
              brand: 'TechWear',
              inStock: true,
              dateAdded: '2024-01-03T11:30:00Z',
              discount: 0
            }
          ]
          setWishlist(mockWishlist)
          localStorage.setItem('wishlist', JSON.stringify(mockWishlist))
        } else {
          setWishlist(localWishlist)
        }
      }
    } catch (error) {
      console.error('Erreur chargement wishlist:', error)
      // Fallback vers localStorage
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setWishlist(localWishlist)
    } finally {
      setLoading(false)
    }
  }

  // FAILLE: Suppression sans vérification côté serveur
  const removeFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // Tentative de suppression côté serveur
      const response = await fetch(`http://62.171.146.0:8000/api/wishlist/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Supprimer localement dans tous les cas
      const updatedWishlist = wishlist.filter(item => item.id !== itemId)
      setWishlist(updatedWishlist)
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
      
      toast.success('Produit retiré de votre liste de souhaits')
    } catch (error) {
      // Même en cas d'erreur, supprimer localement
      const updatedWishlist = wishlist.filter(item => item.id !== itemId)
      setWishlist(updatedWishlist)
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
      toast.success('Produit retiré de votre liste de souhaits')
    }
  }

  const addToCart = (product) => {
    if (!product.inStock) {
      toast.error('Ce produit n\'est plus en stock')
      return
    }

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

  const addAllToCart = () => {
    const availableItems = wishlist.filter(item => item.inStock)
    
    if (availableItems.length === 0) {
      toast.error('Aucun produit disponible dans votre liste')
      return
    }

    availableItems.forEach(item => addToCart(item))
    toast.success(`${availableItems.length} produits ajoutés au panier !`)
  }

  const clearWishlist = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
      setWishlist([])
      localStorage.removeItem('wishlist')
      toast.success('Liste de souhaits vidée')
    }
  }

  // FAILLE: Partage de wishlist exposant des données utilisateur
  const shareWishlist = async () => {
    try {
      const shareData = {
        user_id: user?.id,
        username: user?.username,
        wishlist_items: wishlist.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price
        })),
        shared_at: new Date().toISOString()
      }

      // FAILLE: URL de partage exposée sans validation
      const shareUrl = `${window.location.origin}/shared-wishlist?data=${btoa(JSON.stringify(shareData))}`
      
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Lien de partage copié dans le presse-papiers!')
    } catch (error) {
      toast.error('Erreur lors du partage')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.dateAdded) - new Date(a.dateAdded)
      case 'oldest':
        return new Date(a.dateAdded) - new Date(b.dateAdded)
      case 'price_low':
        return a.price - b.price
      case 'price_high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">❤️</span>
              Ma Liste de Souhaits
            </h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} dans votre liste
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={shareWishlist}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm"
            >
              📤 Partager
            </button>
            
            {wishlist.some(item => item.inStock) && (
              <button
                onClick={addAllToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                🛒 Tout ajouter
              </button>
            )}
            
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                🗑️ Vider
              </button>
            )}
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">💔</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Votre liste de souhaits est vide
            </h3>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits et ajoutez vos favoris à votre liste de souhaits
            </p>
            <Link
              href="/"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
            >
              Explorer nos produits
            </Link>
          </div>
        ) : (
          <div>
            {/* Filtres et tri */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Trier par:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="recent">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                    <option value="price_low">Prix croissant</option>
                    <option value="price_high">Prix décroissant</option>
                    <option value="name">Nom A-Z</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    {wishlist.filter(item => item.inStock).length} en stock
                  </span>
                  <span>•</span>
                  <span>
                    {wishlist.filter(item => item.discount > 0).length} en promotion
                  </span>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                  {/* Badge de réduction */}
                  {item.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                      -{item.discount}%
                    </div>
                  )}
                  
                  {/* Badge stock */}
                  {!item.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded-full z-10">
                      Rupture
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className={`object-cover transition-opacity ${!item.inStock ? 'opacity-60' : ''}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Bouton de suppression */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors z-20"
                    >
                      <span className="text-red-500">🗑️</span>
                    </button>
                  </div>

                  {/* Contenu */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.brand}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1">
                        {item.name}
                      </h3>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Ajouté le {formatDate(item.dateAdded)}
                      </p>
                    </div>

                    {/* Prix */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price)} FCFA
                        </span>
                        {item.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.originalPrice)} FCFA
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          item.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.inStock ? '🛒 Ajouter au panier' : '❌ Rupture de stock'}
                      </button>
                      
                      <Link
                        href={`/product/${item.id}`}
                        className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                      >
                        👁️ Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiques de la wishlist */}
            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de votre liste</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {wishlist.length}
                  </div>
                  <div className="text-sm text-gray-600">Produits</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(wishlist.reduce((total, item) => total + item.price, 0))} FCFA
                  </div>
                  <div className="text-sm text-gray-600">Valeur totale</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {wishlist.filter(item => item.inStock).length}
                  </div>
                  <div className="text-sm text-gray-600">En stock</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(wishlist.reduce((total, item) => 
                      total + (item.originalPrice - item.price), 0
                    ))} FCFA
                  </div>
                  <div className="text-sm text-gray-600">Économies</div>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                ✨ Vous pourriez aussi aimer
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Découvrez des produits similaires à ceux de votre liste de souhaits
              </p>
              <div className="text-center">
                <Link
                  href="/nouveautes"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 inline-block"
                >
                  Voir les nouveautés
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FAILLE: Informations de debug exposées */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>User: {user?.username || 'N/A'}</p>
          <p>Wishlist items: {wishlist.length}</p>
          <p>Local storage size: {JSON.stringify(wishlist).length} bytes</p>
          <p>Sort: {sortBy}</p>
          <p>In stock items: {wishlist.filter(item => item.inStock).length}</p>
        </div>
      </div>
    </div>
  )
}