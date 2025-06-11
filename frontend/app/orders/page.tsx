// app/orders/page.tsx - PAGE MES COMMANDES VULNÉRABLE
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadOrders()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!token) {
      router.push('/login?redirect=/orders')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }

  // FAILLE: Chargement des commandes sans vérification côté serveur
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // FAILLE: Token envoyé sans validation
      const response = await fetch('http://62.171.146.0:8000/api/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        // Données simulées en cas d'échec
        const mockOrders = [
          {
            id: 'UT-12345678',
            date: '2024-01-15T10:30:00Z',
            status: 'completed',
            total: 156200,
            items: [
              { 
                id: 1, 
                name: 'Hoodie Premium Urban', 
                price: 59000, 
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
              },
              { 
                id: 2, 
                name: 'Jean Slim Fit Premium', 
                price: 78700, 
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
              }
            ],
            shipping: {
              address: 'Akwa, Douala',
              method: 'Standard',
              tracking: 'DHL123456789'
            },
            payment: {
              method: 'card',
              last4: '1234'
            }
          },
          {
            id: 'UT-12345679',
            date: '2024-01-10T14:20:00Z',
            status: 'shipped',
            total: 98400,
            items: [
              { 
                id: 3, 
                name: 'Sneakers Urban Elite', 
                price: 98400, 
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
              }
            ],
            shipping: {
              address: 'Bonapriso, Douala',
              method: 'Express',
              tracking: 'DHL987654321'
            },
            payment: {
              method: 'mobile',
              provider: 'Orange Money'
            }
          },
          {
            id: 'UT-12345680',
            date: '2024-01-05T09:15:00Z',
            status: 'pending',
            total: 67800,
            items: [
              { 
                id: 4, 
                name: 'T-shirt Graphique Limited', 
                price: 35900, 
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
              },
              { 
                id: 5, 
                name: 'Casquette Snapback', 
                price: 31900, 
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
              }
            ],
            shipping: {
              address: 'Makepe, Douala',
              method: 'Standard'
            },
            payment: {
              method: 'cash'
            }
          }
        ]
        setOrders(mockOrders)
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  // FAILLE: Annulation de commande sans vérification
  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://62.171.146.0:8000/api/orders/${orderId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Commande annulée')
        loadOrders()
      } else {
        toast.error('Impossible d\'annuler cette commande')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  // FAILLE: Téléchargement de facture sans vérification d'autorisation
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('auth_token')
      // FAILLE: Pas de vérification que l'utilisateur peut accéder à cette facture
      const response = await fetch(`http://62.171.146.0:8000/api/orders/${orderId}/invoice/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture_${orderId}.pdf`
        a.click()
        toast.success('Facture téléchargée')
      }
    } catch (error) {
      toast.error('Erreur téléchargement facture')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Livrée'
      case 'shipped': return 'Expédiée'
      case 'pending': return 'En cours'
      case 'cancelled': return 'Annulée'
      default: return 'Inconnu'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
            <p className="text-gray-600 mt-2">
              Suivez l'état de vos commandes et téléchargez vos factures
            </p>
          </div>
          
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'shipped' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expédiées ({orders.filter(o => o.status === 'shipped').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées ({orders.filter(o => o.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {filter === 'all' ? 'Aucune commande' : `Aucune commande ${getStatusLabel(filter).toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore passé de commandes.'
                : `Aucune commande avec le statut "${getStatusLabel(filter).toLowerCase()}".`
              }
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* En-tête de commande */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Commande {order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Passée le {formatDate(order.date)}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(order.total)} FCFA
                      </span>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Annuler
                        </button>
                      )}
                      
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        📄 Facture
                      </button>
                    </div>
                  </div>
                </div>

                {/* Produits */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)} FCFA
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} FCFA/unité
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informations de livraison et suivi */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Livraison</h4>
                        <p className="text-sm text-gray-600">{order.shipping.address}</p>
                        <p className="text-sm text-gray-600">Méthode: {order.shipping.method}</p>
                        {order.shipping.tracking && (
                          <p className="text-sm text-blue-600 font-medium">
                            Suivi: {order.shipping.tracking}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Paiement</h4>
                        {order.payment.method === 'card' && (
                          <p className="text-sm text-gray-600">
                            Carte se terminant par {order.payment.last4}
                          </p>
                        )}
                        {order.payment.method === 'mobile' && (
                          <p className="text-sm text-gray-600">
                            {order.payment.provider}
                          </p>
                        )}
                        {order.payment.method === 'cash' && (
                          <p className="text-sm text-gray-600">
                            Paiement à la livraison
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAILLE: Informations de debug exposées */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>User ID: {user?.id || 'N/A'}</p>
          <p>Session: {localStorage.getItem('auth_token')?.substring(0, 20)}...</p>
          <p>Orders loaded: {orders.length}</p>
          <p>Filter: {filter}</p>
        </div>
      </div>
    </div>
  )
}