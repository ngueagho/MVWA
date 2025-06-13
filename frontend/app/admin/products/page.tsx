// app/admin/products/page.tsx - DASHBOARD ADMIN VULNÉRABLE AVEC GESTION PRODUITS
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminProductsPage() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
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

  // FAILLE: Vérification d'admin côté client uniquement
  const checkAdminAccess = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    // FAILLE: Pas de vérification token côté serveur
    if (!token) {
      router.push('/login?redirect=/admin/products')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      // FAILLE: Contrôle d'accès faible
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
      { id: 'soldes', name: 'Soldes', slug: 'soldes' }
    ]
    setCategories(defaultCategories)
  }

  const loadProducts = () => {
    try {
      const savedProducts = localStorage.getItem('admin_products')
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        // ✅ SEULE CORRECTION NÉCESSAIRE: Éviter l'erreur originalPrice undefined
        const cleanedProducts = parsedProducts.map(product => ({
          ...product,
          originalPrice: product.originalPrice || product.price, // Fix minimal
        }))
        setProducts(cleanedProducts)
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
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
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
            imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
            tags: 'jean,slim,femme',
            discount: 12,
            dateAdded: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Sneakers Urban Black',
            description: 'Baskets urbaines en cuir noir, semelle confort',
            price: 95900,
            originalPrice: 109900,
            category: 'accessoires',
            brand: 'UrbanTendance',
            inStock: true,
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
            tags: 'chaussures,sneakers,noir',
            discount: 13,
            dateAdded: new Date().toISOString()
          },
          {
            id: 4,
            name: 'Sac à Dos Tech',
            description: 'Sac à dos avec compartiment laptop, design moderne',
            price: 67500,
            originalPrice: 75000,
            category: 'accessoires',
            brand: 'UrbanTendance',
            inStock: true,
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
            tags: 'sac,tech,laptop',
            discount: 10,
            dateAdded: new Date().toISOString()
          }
        ]
        setProducts(demoProducts)
        localStorage.setItem('admin_products', JSON.stringify(demoProducts))
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // FAILLE: Pas de validation côté serveur
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      originalPrice: parseInt(formData.originalPrice) || parseInt(formData.price), // ✅ Fix minimal
      discount: formData.originalPrice ? 
        Math.round(((parseInt(formData.originalPrice) - parseInt(formData.price)) / parseInt(formData.originalPrice)) * 100) : 0,
      id: editingProduct ? editingProduct.id : Date.now(),
      dateAdded: editingProduct ? editingProduct.dateAdded : new Date().toISOString()
    }

    let updatedProducts
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p)
      toast.success('Produit modifié avec succès!')
    } else {
      updatedProducts = [...products, productData]
      toast.success('Produit ajouté avec succès!')
    }

    setProducts(updatedProducts)
    // FAILLE: Stockage côté client uniquement
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
    localStorage.setItem('public_products', JSON.stringify(updatedProducts))
    
    resetForm()
  }

  // FAILLE: Suppression sans confirmation côté serveur
  const deleteProduct = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const updatedProducts = products.filter(p => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
      localStorage.setItem('public_products', JSON.stringify(updatedProducts))
      toast.success('Produit supprimé!')
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || product.price).toString(), // ✅ Fix minimal
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

  // FAILLE: Modification directe des données sans vérification
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

  // FAILLE: Recherche côté client vulnérable
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
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Gestion des Produits</h1>
            <p className="text-gray-600 mt-2">Interface admin  - Créez et gérez votre catalogue</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ajouter un produit
          </button>
        </div>

        {/* FAILLE: Informations sensibles exposées */}
        

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
                placeholder="🔍 Recherche côté client ..."
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
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center'
                            }}
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
                        title="VULNÉRABLE: Modification directe sans vérification"
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
                        title="VULNÉRABLE: Pas de vérification de permissions"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="VULNÉRABLE: Suppression sans autorisation serveur"
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
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification - VULNÉRABLE */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
                  <span className="text-red-500 text-sm ml-2"></span>
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* FAILLE: Formulaire sans protection CSRF */}
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
                    placeholder="Description du produit (pas de validation XSS)..."
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
                    placeholder="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center"
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
                    placeholder="coton, premium, urban (pas de validation injection)"
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
                    title="VULNÉRABLE: Soumission sans protection"
                  >
                    {editingProduct ? 'Modifier' : 'Ajouter'} (Non sécurisé)
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