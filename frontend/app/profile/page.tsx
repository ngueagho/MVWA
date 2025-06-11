// app/profile/page.tsx - PROFIL UTILISATEUR VULNÉRABLE
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    bio: ''
  })
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadUserData()
    loadOrders()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login?redirect=/profile')
      return
    }
  }

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        const user = JSON.parse(userData)
        setUser(user)
        setFormData({
          username: user.username || '',
          email: user.email || '',
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || 'Douala',
          bio: user.bio || ''
        })
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = () => {
    // Simulation des commandes utilisateur
    const mockOrders = [
      {
        id: 'UT-12345678',
        date: '2024-01-15',
        status: 'completed',
        total: 156200,
        items: [
          { name: 'Hoodie Premium', quantity: 1, price: 59000 },
          { name: 'Jean Slim Fit', quantity: 1, price: 78700 }
        ]
      },
      {
        id: 'UT-12345679',
        date: '2024-01-10',
        status: 'shipped',
        total: 98400,
        items: [
          { name: 'Sneakers Urban', quantity: 1, price: 98400 }
        ]
      }
    ]
    setOrders(mockOrders)
  }

  // FAILLE: Mise à jour profil sans validation côté serveur
  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      
      // FAILLE: Données envoyées sans validation
      const response = await fetch('http://62.171.146.0:8000/api/users/profile/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // FAILLE: Stockage direct sans validation
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setEditing(false)
        
        toast.success('Profil mis à jour avec succès!')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // FAILLE: Upload d'avatar sans validation
  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // FAILLE: Pas de validation du type de fichier
    const formData = new FormData()
    formData.append('avatar', file)
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://62.171.146.0:8000/api/users/avatar/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast.success('Avatar mis à jour!')
        loadUserData()
      }
    } catch (error) {
      toast.error('Erreur upload avatar')
    }
  }

  // FAILLE: Suppression de compte sans confirmation forte
  const deleteAccount = async () => {
    const confirmation = prompt('Tapez "DELETE" pour confirmer la suppression:')
    if (confirmation !== 'DELETE') return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://62.171.146.0:8000/api/users/delete/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        localStorage.clear()
        toast.success('Compte supprimé')
        router.push('/')
      }
    } catch (error) {
      toast.error('Erreur suppression compte')
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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header du profil */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white text-sm">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6">
            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Membre depuis {new Date().getFullYear()}</p>
          </div>

          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {[
                { id: 'profile', name: 'Profil', icon: '👤' },
                { id: 'orders', name: 'Commandes', icon: '📦' },
                { id: 'security', name: 'Sécurité', icon: '🔒' },
                { id: 'preferences', name: 'Préférences', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des tabs */}
          <div className="p-6">
            {/* Tab Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editing ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Douala">Douala</option>
                          <option value="Yaoundé">Yaoundé</option>
                          <option value="Bafoussam">Bafoussam</option>
                          <option value="Bamenda">Bamenda</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nom d'utilisateur</label>
                        <p className="mt-1 text-sm text-gray-900">{user?.username || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{user?.email || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Prénom</label>
                        <p className="mt-1 text-sm text-gray-900">{formData.firstName || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nom</label>
                        <p className="mt-1 text-sm text-gray-900">{formData.lastName || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                        <p className="mt-1 text-sm text-gray-900">{formData.phone || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ville</label>
                        <p className="mt-1 text-sm text-gray-900">{formData.city || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Adresse</label>
                      <p className="mt-1 text-sm text-gray-900">{formData.address || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Bio</label>
                      <p className="mt-1 text-sm text-gray-900">{formData.bio || 'Aucune bio renseignée'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Commandes */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes commandes</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-gray-500">Aucune commande pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">Commande {order.id}</h3>
                            <p className="text-sm text-gray-500">Passée le {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'completed' ? 'Livrée' : 
                             order.status === 'shipped' ? 'Expédiée' : 'En cours'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.price.toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="font-semibold text-lg">Total: {order.total.toLocaleString()} FCFA</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Sécurité du compte</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Changer le mot de passe</h3>
                    <form className="space-y-3">
                      <input
                        type="password"
                        placeholder="Mot de passe actuel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </form>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Sessions actives</h3>
                    <p className="text-sm text-yellow-700 mb-3">Vous êtes connecté sur ces appareils :</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Chrome sur Windows - Douala, CM</span>
                        <span className="text-green-600">Session actuelle</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Mobile Safari - IP: 192.168.1.105</span>
                        <button className="text-red-600 hover:text-red-800">Déconnecter</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-medium text-red-800 mb-2">Zone dangereuse</h3>
                    <p className="text-sm text-red-700 mb-3">
                      La suppression de votre compte est irréversible. Toutes vos données seront perdues.
                    </p>
                    <button
                      onClick={deleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Préférences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Préférences</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'email_orders', label: 'Notifications de commandes par email', checked: true },
                        { id: 'email_promo', label: 'Offres promotionnelles par email', checked: false },
                        { id: 'sms_delivery', label: 'SMS de livraison', checked: true },
                        { id: 'newsletter', label: 'Newsletter hebdomadaire', checked: false }
                      ].map((pref) => (
                        <label key={pref.id} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={pref.checked}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Confidentialité</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'public_profile', label: 'Profil public', checked: false },
                        { id: 'show_orders', label: 'Montrer mes commandes récentes', checked: false },
                        { id: 'analytics', label: 'Autoriser les cookies analytics', checked: true },
                        { id: 'marketing', label: 'Cookies marketing', checked: false }
                      ].map((pref) => (
                        <label key={pref.id} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={pref.checked}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enregistrer les préférences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}