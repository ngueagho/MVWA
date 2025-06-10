
// ============================================
// 4. MODIFICATION: app/admin/products/page.tsx
// ============================================

// app/admin/products/page.tsx - MODIFIÉ pour synchroniser avec l'API
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import urbanAPI from '../../../utils/api'
import ApiStatus from '../../../components/ApiStatus'

export default function AdminProductsPage() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [apiConnected, setApiConnected] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    inStock: true,
    featured: false,
    imageUrl: '',
    tags: '',
    discount: 0
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
    loadCategories()
    loadProducts()
  }, [])

  const checkAdminAccess = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!token) {
      router.push('/login?redirect=/admin/products')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      if (user.username === 'admin' || user.is_staff || user.role === 'admin') {
        setUser(user)
      } else {
        toast.error('Accès refusé - Administrateur requis')
        router.push('/')
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = () => {
    const defaultCategories = [
      { id: 'homme', name: 'Homme', slug: 'homme' },
      { id: 'femme', name: 'Femme', slug: 'femme' },
      { id: 'accessoires', name: 'Accessoires', slug: 'accessoires' },
      { id: 'nouveautes', name: 'Nouveautés', slug: 'nouveautes' },
      { id: 'soldes', name: 'Soldes', slug: 'soldes' },
      { id: 'sport', name: 'Sport', slug: 'sport' }
    ]
    setCategories(defaultCategories)
  }

  const loadProducts = async () => {
    try {
      // TENTATIVE 1: Charger via l'API Django
      const productsData = await urbanAPI.getAllProducts()
      
      if (productsData.products && productsData.products.length > 0) {
        // Convertir le format API vers le format local
        const convertedProducts = productsData.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.final_price || product.price,
          originalPrice: product.price,
          category: product.category,
          brand: product.brand,
          inStock: product.in_stock,
          featured: product.is_featured,
          imageUrl: product.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          tags: product.tags || 'urban,tendance',
          discount: product.discount_percentage || 0,
          dateAdded: product.created_at || new Date().toISOString()
        }))
        
        setProducts(convertedProducts)
        setApiConnected(true)
        toast.success('📦 Produits chargés via API Django!')
        
        // Synchroniser avec localStorage
        localStorage.setItem('admin_products', JSON.stringify(convertedProducts))
        localStorage.setItem('public_products', JSON.stringify(convertedProducts))
      } else {
        throw new Error('Aucun produit API')
      }
    } catch (error) {
      console.warn('API Django non disponible, utilisation localStorage:', error)
      setApiConnected(false)
      
      // FALLBACK: localStorage
      const savedProducts = localStorage.getItem('admin_products')
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      } else {
        // Produits de démonstration
        const demoProducts = [
          {
            id: 1,
            name: 'T-shirt Premium Urban',
            description: 'T-shirt en coton biologique, coupe moderne',
            price: 25900,
            originalPrice: 29900,
            category: 'homme',
            brand: 'UrbanTendance',
            inStock: true,
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            tags: 'coton,premium,urban',
            discount: 13,
            dateAdded: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Jean Slim Femme',
            description: 'Jean taille haute, coupe ajustée',
            price: 78700,
            originalPrice: 89900,
            category: 'femme',
            brand: 'UrbanTendance',
            inStock: true,
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
            tags: 'jean,slim,femme',
            discount: 12,
            dateAdded: new Date().toISOString()
          }
        ]
        setProducts(demoProducts)
        localStorage.setItem('admin_products', JSON.stringify(demoProducts))
        toast.error('⚠️ Mode fallback - API Django déconnectée')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      originalPrice: parseInt(formData.originalPrice) || parseInt(formData.price),
      discount: formData.originalPrice ? 
        Math.round(((parseInt(formData.originalPrice) - parseInt(formData.price)) / parseInt(formData.originalPrice)) * 100) : 0,
      id: editingProduct ? editingProduct.id : Date.now(),
      dateAdded: editingProduct ? editingProduct.dateAdded : new Date().toISOString()
    }

    let updatedProducts
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p)
      toast.success('✅ Produit modifié avec succès!')
    } else {
      updatedProducts = [...products, productData]
      toast.success('✅ Produit ajouté avec succès!')
    }

    setProducts(updatedProducts)
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
    localStorage.setItem('public_products', JSON.stringify(updatedProducts))
    
    if (apiConnected) {
      toast.success('🔄 Synchronisation avec API Django possible')
    }
    
    resetForm()
  }

  const deleteProduct = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const updatedProducts = products.filter(p => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
      localStorage.setItem('public_products', JSON.stringify(updatedProducts))
      toast.success('🗑️ Produit supprimé!')
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      category: product.category,
      brand: product.brand,
      inStock: product.inStock,
      featured: product.featured,
      imageUrl: product.imageUrl,
      tags: product.tags,
      discount: product.discount
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      brand: '',
      inStock: true,
      featured: false,
      imageUrl: '',
      tags: '',
      discount: 0
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const toggleStock = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, inStock: !p.inStock } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
    localStorage.setItem('public_products', JSON.stringify(updatedProducts))
  }

  const toggleFeatured = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
    localStorage.setItem('public_products', JSON.stringify(updatedProducts))
  }

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
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
      <ApiStatus />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Gestion des Produits</h1>
            <p className="text-gray-600 mt-2">
              Créez et gérez votre catalogue produits
              {apiConnected ? (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🟢 API Django
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🟡 Mode Local
                </span>
              )}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ajouter un produit
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Produits</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">En Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Produits Vedettes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.featured).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Prix Moyen</p>
                <p className="text-2xl font-bold text-purple-600">
                  {products.length > 0 ? 
                    formatPrice(Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)) : 0
                  } FCFA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            {apiConnected && (
              <button
                onClick={async () => {
                  try {
                    await urbanAPI.createTestData()
                    toast.success('🧪 Données de test créées via API!')
                    loadProducts()
                  } catch (error) {
                    toast.error('❌ Erreur création données de test')
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                🧪 Créer données test
              </button>
            )}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vedette
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                          {product.discount > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)} FCFA
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)} FCFA
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.inStock ? '✅ En stock' : '❌ Rupture'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`text-2xl ${product.featured ? '⭐' : '☆'}`}
                        title={product.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                      >
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
            {apiConnected && (
              <button
                onClick={async () => {
                  try {
                    await urbanAPI.createTestData()
                    toast.success('🧪 Données de test créées!')
                    loadProducts()
                  } catch (error) {
                    toast.error('❌ Erreur création données')
                  }
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Créer des produits de test
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: T-shirt Premium Urban"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: UrbanTendance"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Description du produit..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de vente (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="25900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix original (FCFA)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="29900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="coton, premium, urban"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                      className="mr-2"
                    />
                    En stock
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="mr-2"
                    />
                    Produit vedette
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingProduct ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

// app/login/page.tsx - MODIFIÉ pour utiliser l'API Django
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
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent)
      
      // Vérifier si l'utilisateur est déjà connecté
      const token = localStorage.getItem('auth_token')
      if (token) {
        router.push('/dashboard')
      }
    }
  }, [router])

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
      // TENTATIVE 1: API Django
      const data = await urbanAPI.login(formData)
      
      if (data.success) {
        toast.success('Connexion réussie via API Django!')
        
        setTimeout(() => {
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect')
          if (redirectUrl && redirectUrl.startsWith('/')) {
            router.push(redirectUrl)
          } else {
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        throw new Error(data.error || 'Erreur de connexion')
      }
    } catch (apiError) {
      console.warn('API Django non disponible:', apiError.message)
      
      // FALLBACK: Authentification locale
      if ((formData.username === 'admin' && formData.password === 'admin123') ||
          (formData.username === 'test' && formData.password === 'test123')) {
        
        const mockUser = {
          id: formData.username === 'admin' ? 1 : 2,
          username: formData.username,
          email: `${formData.username}@urbantendance.com`,
          first_name: formData.username === 'admin' ? 'Admin' : 'Test',
          last_name: 'User',
          is_staff: formData.username === 'admin',
          role: formData.username === 'admin' ? 'admin' : 'user'
        }
        
        localStorage.setItem('auth_token', `fallback_token_${Date.now()}`)
        localStorage.setItem('user_data', JSON.stringify(mockUser))
        
        toast.success('Connexion réussie (mode fallback)!')
        
        setTimeout(() => {
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect')
          if (redirectUrl && redirectUrl.startsWith('/')) {
            router.push(redirectUrl)
          } else {
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        toast.error('Identifiants incorrects')
        
        // FAILLE: Information leakage sur les tentatives
        if (attemptCount >= 3) {
          toast.error(`Attention: ${attemptCount} tentatives de connexion`)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <ApiStatus />
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur ou Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Entrez votre nom d'utilisateur"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
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
                  placeholder="Entrez votre mot de passe"
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
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié?
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
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            {/* FAILLE: Informations de debug exposées */}
            {isClient && process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Tentatives: {attemptCount}</p>
                <p>User Agent: {userAgent.substring(0, 50)}...</p>
                <p>IP simulée: 192.168.1.{Math.floor(Math.random() * 255)}</p>
              </div>
            )}
          </form>

          {/* Connexion sociale */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Se connecter avec Google</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Se connecter avec Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Comptes de test */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">🧪 Comptes de test disponibles</h4>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Test:</strong> test / test123</p>
              <p className="text-blue-500 italic">API Django + fallback localStorage</p>
            </div>
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              <p><strong>✨ Nouveau:</strong> Connexion via API Django avec données réelles !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}