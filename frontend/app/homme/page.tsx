// app/homme/page.tsx - VERSION CORRIGÉE
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'
import toast from 'react-hot-toast'

export default function HommePage() {
  const [dynamicProducts, setDynamicProducts] = useState([])

  // Fonction utilitaire pour normaliser les prix
  const normalizePrice = (price) => {
    if (typeof price === 'string') {
      return parseInt(price.replace(/,/g, ''));
    }
    return parseInt(price) || 0;
  };

  // Fonction pour calculer le pourcentage de réduction
  const calculateDiscount = (originalPrice, currentPrice) => {
    const original = normalizePrice(originalPrice);
    const current = normalizePrice(currentPrice);
    
    if (original <= 0 || current <= 0) return 0;
    
    return Math.round(((original - current) / original) * 100);
  };

  // Produits statiques pour la page homme
  const staticProducts = [
    { 
      id: 101, 
      name: "T-shirt Urban Classic", 
      price: "25,900", 
      originalPrice: "29,900",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
      description: "T-shirt en coton premium, coupe moderne",
      featured: true
    },
    { 
      id: 102, 
      name: "Jean Straight Fit", 
      price: "75,600", 
      originalPrice: "85,000",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
      description: "Jean droit classique, denim de qualité",
      featured: false
    },
    { 
      id: 103, 
      name: "Hoodie Premium", 
      price: "89,900", 
      originalPrice: "99,900",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
      description: "Sweat à capuche confortable, coton bio",
      featured: true
    },
    { 
      id: 104, 
      name: "Chemise Oxford", 
      price: "65,400", 
      originalPrice: "75,000",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop&crop=center",
      description: "Chemise élégante pour toutes occasions",
      featured: false
    },
    { 
      id: 105, 
      name: "Sneakers Urban", 
      price: "95,900", 
      originalPrice: "109,900",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
      description: "Baskets tendance, semelle confort",
      featured: true
    },
    { 
      id: 106, 
      name: "Veste Bomber", 
      price: "128,700", 
      originalPrice: "145,000",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center",
      description: "Veste aviateur moderne, coupe ajustée",
      featured: false
    },
    { 
      id: 107, 
      name: "Short Sport", 
      price: "45,900", 
      originalPrice: "55,000",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&crop=center",
      description: "Short de sport respirant, séchage rapide",
      featured: false
    },
    { 
      id: 108, 
      name: "Polo Classic", 
      price: "52,800", 
      originalPrice: "65,000",
      image: "https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=400&h=400&fit=crop&crop=center",
      description: "Polo intemporel, coton piqué",
      featured: true
    }
  ]

  // Charger les produits dynamiques depuis l'admin
  useEffect(() => {
    const loadDynamicProducts = () => {
      try {
        const adminProducts = localStorage.getItem('admin_products')
        if (adminProducts) {
          const allProducts = JSON.parse(adminProducts)
          // Filtrer seulement les produits de la catégorie "homme"
          const hommeProducts = allProducts.filter(product => product.category === 'homme')
          setDynamicProducts(hommeProducts)
        }
      } catch (error) {
        console.error('Erreur chargement produits dynamiques:', error)
      }
    }

    loadDynamicProducts()
    
    // Écouter les changements dans localStorage (quand un admin ajoute un produit)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_products' || e.key === 'public_products') {
        loadDynamicProducts()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Fusionner produits statiques et dynamiques
  const allProducts = [...staticProducts, ...dynamicProducts]
  const featuredProducts = allProducts.filter(product => product.featured)

  const addToCart = (product) => {
    try {
      // Récupérer le panier existant
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      // Vérifier si le produit existe déjà
      const existingItem = existingCart.find((item) => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        existingCart.push({ 
          ...product, 
          quantity: 1,
          price: typeof product.price === 'string' ? product.price : product.price.toString()
        })
      }
      
      // Sauvegarder le panier
      localStorage.setItem('cart', JSON.stringify(existingCart))
      toast.success(`${product.name} ajouté au panier !`)
    } catch (error) {
      console.error('Erreur ajout panier:', error)
      toast.error('Erreur lors de l\'ajout au panier')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">👔 Collection Homme</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de vêtements masculins. 
            Style urbain moderne, qualité premium et designs contemporains.
          </p>
        </div>

        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🔥 Offre Spéciale Homme</h2>
          <p className="text-lg opacity-90 mb-4">
            Jusqu'à -30% sur une sélection de produits masculins
          </p>
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Code: HOMME30 • Livraison gratuite dès 75,000 FCFA</span>
          </div>
        </div>

        {/* Produits vedettes */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">⭐ Produits Vedettes</h2>
              <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                Les plus populaires
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center'
                      }}
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{calculateDiscount(product.originalPrice, product.price)}%
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ⭐ Vedette
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{product.description || "Style urbain masculin"}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xl font-bold text-blue-600">{typeof product.price === 'string' ? product.price : new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">{typeof product.originalPrice === 'string' ? product.originalPrice : new Intl.NumberFormat('fr-FR').format(product.originalPrice)} FCFA</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tous les produits homme */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🛍️ Tous les Produits Homme</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• {allProducts.length} produits disponibles</span>
              <span>• Retours gratuits 30 jours</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square relative">
                  <Image
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center'
                    }}
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      -{calculateDiscount(product.originalPrice, product.price)}%
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ⭐
                    </div>
                  )}
                  {!product.inStock && product.inStock !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Rupture de stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.description || "Style urbain masculin"}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-blue-600">{typeof product.price === 'string' ? product.price : new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{typeof product.originalPrice === 'string' ? product.originalPrice : new Intl.NumberFormat('fr-FR').format(product.originalPrice)} FCFA</p>
                      )}
                    </div>
                    {product.brand && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock && product.inStock !== undefined}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      !product.inStock && product.inStock !== undefined
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {!product.inStock && product.inStock !== undefined ? 'Rupture de stock' : 'Ajouter au panier'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intégration du composant ProductGrid pour les produits dynamiques de l'admin */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🆕 Nouveautés Admin</h2>
            <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
              Ajoutés par l'administration
            </span>
          </div>
          <ProductGrid category="homme" showOutOfStock={true} />
        </div>

        {/* Section avantages */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            ✨ Pourquoi choisir UrbanTendance Homme ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👕</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Qualité Premium</h4>
              <p className="text-gray-600 text-sm">
                Matériaux haut de gamme et finitions soignées pour un style durable
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Livraison Rapide</h4>
              <p className="text-gray-600 text-sm">
                Expédition sous 24h et livraison gratuite dès 75,000 FCFA
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Style Unique</h4>
              <p className="text-gray-600 text-sm">
                Designs exclusifs et tendances pour un look authentique
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎯 Trouvez votre style parfait</h3>
          <p className="text-lg opacity-90 mb-6">
            Explorez nos autres collections pour compléter votre garde-robe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/accessoires"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👜 Accessoires
            </a>
            <a
              href="/nouveautes"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              ✨ Nouveautés
            </a>
            <a
              href="/soldes"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              🔥 Soldes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}