// app/accessoires/page.tsx - PAGE ACCESSOIRES AVEC PRODUITS STATIQUES + DYNAMIQUES
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'
import toast from 'react-hot-toast'

export default function AccessoiresPage() {
  const [dynamicProducts, setDynamicProducts] = useState([])

  // Produits statiques pour la page accessoires
  const staticProducts = [
    { 
      id: 201, 
      name: "Montre Smart Urban", 
      price: "185,900", 
      originalPrice: "219,900",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
      description: "Montre connectée étanche, écran AMOLED",
      featured: true
    },
    { 
      id: 202, 
      name: "Sac à Dos Tech", 
      price: "67,500", 
      originalPrice: "79,900",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      description: "Sac à dos avec compartiment laptop 15.6\"",
      featured: true
    },
    { 
      id: 203, 
      name: "Sneakers Urban Black", 
      price: "95,900", 
      originalPrice: "115,000",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
      description: "Baskets urbaines en cuir, semelle confort",
      featured: true
    },
    { 
      id: 204, 
      name: "Casquette Snapback", 
      price: "35,600", 
      originalPrice: "42,000",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80e2040cf?w=400&h=400&fit=crop&crop=center",
      description: "Casquette ajustable, broderie logo",
      featured: false
    },
    { 
      id: 205, 
      name: "Lunettes Aviateur", 
      price: "125,400", 
      originalPrice: "145,000",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center",
      description: "Lunettes de soleil UV400, verres polarisés",
      featured: true
    },
    { 
      id: 206, 
      name: "Ceinture Cuir Premium", 
      price: "58,900", 
      originalPrice: "69,900",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      description: "Ceinture en cuir véritable, boucle métallique",
      featured: false
    },
    { 
      id: 207, 
      name: "Portefeuille Slim", 
      price: "45,600", 
      originalPrice: "55,000",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&crop=center",
      description: "Portefeuille minimaliste, protection RFID",
      featured: false
    },
    { 
      id: 208, 
      name: "Bracelet Acier", 
      price: "78,900", 
      originalPrice: "89,900",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center",
      description: "Bracelet en acier inoxydable, design moderne",
      featured: true
    },
    { 
      id: 209, 
      name: "Sac Bandoulière", 
      price: "89,700", 
      originalPrice: "109,000",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
      description: "Sac en toile et cuir, compartiments multiples",
      featured: false
    },
    { 
      id: 210, 
      name: "Écouteurs Sans Fil", 
      price: "156,800", 
      originalPrice: "189,900",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop&crop=center",
      description: "Écouteurs Bluetooth 5.0, réduction de bruit",
      featured: true
    },
    { 
      id: 211, 
      name: "Collier Chaîne", 
      price: "65,400", 
      originalPrice: "78,000",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
      description: "Collier en acier doré, maillons fins",
      featured: false
    },
    { 
      id: 212, 
      name: "Gants Cuir Tactiles", 
      price: "42,900", 
      originalPrice: "52,000",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center",
      description: "Gants en cuir compatibles écrans tactiles",
      featured: false
    }
  ]

  // Charger les produits dynamiques depuis l'admin
  useEffect(() => {
    const loadDynamicProducts = () => {
      try {
        const adminProducts = localStorage.getItem('admin_products')
        if (adminProducts) {
          const allProducts = JSON.parse(adminProducts)
          // Filtrer seulement les produits de la catégorie "accessoires"
          const accessoiresProducts = allProducts.filter(product => product.category === 'accessoires')
          setDynamicProducts(accessoiresProducts)
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">👜 Collection Accessoires</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complétez votre style avec notre sélection d'accessoires premium. 
            Montres, bijoux, sacs et bien plus pour parfaire votre look.
          </p>
        </div>

        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">💎 Accessoires Premium</h2>
          <p className="text-lg opacity-90 mb-4">
            L'élégance dans les détails • Qualité exceptionnelle
          </p>
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Code: ACCESS15 • -15% sur tous les accessoires</span>
          </div>
        </div>

        {/* Produits vedettes */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">⭐ Accessoires Vedettes</h2>
              <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
                Sélection premium
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
                        -{Math.round(((parseInt(product.originalPrice.replace(/,/g, '')) - parseInt(product.price.toString().replace(/,/g, ''))) / parseInt(product.originalPrice.replace(/,/g, ''))) * 100)}%
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ⭐ Vedette
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{product.description || "Accessoire premium"}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xl font-bold text-green-600">{typeof product.price === 'string' ? product.price : new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">{product.originalPrice} FCFA</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tous les accessoires */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">✨ Tous les Accessoires</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• {allProducts.length} accessoires disponibles</span>
              <span>• Garantie qualité</span>
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
                      -{Math.round(((parseInt(product.originalPrice.replace(/,/g, '')) - parseInt(product.price.toString().replace(/,/g, ''))) / parseInt(product.originalPrice.replace(/,/g, ''))) * 100)}%
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
                  <p className="text-gray-600 mb-3 text-sm">{product.description || "Accessoire premium"}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-green-600">{typeof product.price === 'string' ? product.price : new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{product.originalPrice} FCFA</p>
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
                        : 'bg-green-600 text-white hover:bg-green-700'
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
            <h2 className="text-2xl font-bold text-gray-900">🆕 Nouveaux Accessoires Admin</h2>
            <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
              Ajoutés par l'administration
            </span>
          </div>
          <ProductGrid category="accessoires" showOutOfStock={true} />
        </div>

        {/* Guide des accessoires */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            💍 Guide des Accessoires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⌚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Montres</h4>
              <p className="text-gray-600 text-sm">
                Montres classiques et connectées pour toutes les occasions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👜</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Maroquinerie</h4>
              <p className="text-gray-600 text-sm">
                Sacs, portefeuilles et accessoires en cuir de qualité
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bijoux</h4>
              <p className="text-gray-600 text-sm">
                Bijoux tendance et intemporels pour homme et femme
              </p>
            </div>
          </div>
        </div>

        {/* Section entretien */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            🧼 Conseils d'Entretien
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">💍 Bijoux & Montres</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Nettoyer délicatement avec un chiffon doux
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Éviter le contact avec les parfums
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Ranger dans des boîtes séparées
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Service après-vente disponible
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">👜 Maroquinerie</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Traitement du cuir avec des produits spécialisés
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Protection contre l'humidité excessive
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Stockage dans un endroit aéré
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Réparations possibles en atelier
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-green-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎁 Idées Cadeaux</h3>
          <p className="text-lg opacity-90 mb-6">
            Nos accessoires font de parfaits cadeaux pour vos proches
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/femme"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👗 Pour Elle
            </a>
            <a
              href="/homme"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              👔 Pour Lui
            </a>
            <a
              href="/contact"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              💬 Conseil Personnel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}