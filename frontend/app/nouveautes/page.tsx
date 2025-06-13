// app/nouveautes/page.tsx - PAGE NOUVEAUTÉS AVEC PRODUITS DYNAMIQUES
'use client'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'

export default function NouveautesPage() {
  // Produits nouveautés avec de belles images
  const nouveautesProducts = [
    {
      id: 101,
      name: "Urban Tech Hoodie",
      price: "89,500",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      category: "nouveautes",
      featured: true,
      description: "Sweat à capuche technique urbain"
    },
    {
      id: 102,
      name: "Smart Denim Jacket",
      price: "125,900",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      category: "nouveautes",
      featured: true,
      description: "Veste en jean intelligente avec poches tech"
    },
    {
      id: 103,
      name: "Neo Sneakers",
      price: "95,700",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      category: "nouveautes",
      featured: true,
      description: "Baskets futuristes ultra-confortables"
    },
    {
      id: 104,
      name: "Cargo Pants 2.0",
      price: "78,400",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "Pantalon cargo moderne et fonctionnel"
    },
    {
      id: 105,
      name: "Eco Streetwear Tee",
      price: "42,300",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "T-shirt éco-responsable street style"
    },
    {
      id: 106,
      name: "Digital Backpack",
      price: "156,800",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "Sac à dos connecté avec port USB"
    },
    {
      id: 107,
      name: "Versatile Blazer",
      price: "134,600",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "Blazer adaptatif jour/nuit"
    },
    {
      id: 108,
      name: "Performance Leggings",
      price: "65,200",
      image: "https://images.unsplash.com/photo-1506629905607-42e47a8e7493?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "Legging haute performance"
    },
    {
      id: 109,
      name: "Minimalist Watch",
      price: "198,900",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      category: "nouveautes",
      description: "Montre connectée minimaliste"
    }
  ]

  const addToCart = (product: any) => {
    // Récupérer le panier existant
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Vérifier si le produit existe déjà
    const existingItem = existingCart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...product, quantity: 1 })
    }
    
    // Sauvegarder le panier
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success(`${product.name} ajouté au panier !`)
  }

  // Produits vedettes (featured)
  const featuredProducts = nouveautesProducts.filter(p => p.featured)
  // Tous les produits nouveautés
  const allProducts = nouveautesProducts

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">✨ Nouveautés</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos dernières arrivées ! Tendances actuelles, designs innovants 
            et pièces exclusives pour rester à la pointe de la mode urbaine.
          </p>
        </div>

        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🚀 Nouvelles Arrivées</h2>
          <p className="text-lg opacity-90 mb-4">
            Soyez les premiers à porter les dernières tendances 2024
          </p>
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Code: NEW20 • -20% sur toutes les nouveautés</span>
          </div>
        </div>

        {/* Produits vedettes nouveautés */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🌟 Coups de Cœur</h2>
            <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
              Exclusivités
            </span>
          </div>
          
          {/* Grille des produits vedettes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✨ Nouveau
                  </span>
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <p className="text-2xl font-bold text-purple-600 mb-4">{product.price} FCFA</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fallback vers ProductGrid dynamique si besoin */}
          <ProductGrid category="nouveautes" featured={true} />
        </div>

        {/* Toutes les nouveautés */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🆕 Toutes les Nouveautés</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• Arrivages chaque semaine</span>
              <span>• Éditions limitées</span>
            </div>
          </div>
          
          {/* Grille de tous les produits */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {allProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Dispo
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-purple-600 mb-3">{product.price} FCFA</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fallback vers ProductGrid dynamique */}
          <ProductGrid category="nouveautes" showOutOfStock={true} />
        </div>

        {/* Section tendances */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            📈 Tendances 2024
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Couleurs Vives</h4>
              <p className="text-gray-600 text-sm">
                Osez les couleurs éclatantes et les imprimés audacieux cette saison
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mode Durable</h4>
              <p className="text-gray-600 text-sm">
                Matériaux éco-responsables et production éthique au cœur de nos collections
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tech Fashion</h4>
              <p className="text-gray-600 text-sm">
                Vêtements intelligents et accessoires connectés pour le style moderne
              </p>
            </div>
          </div>
        </div>

        {/* Section inspiration */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            💡 Inspiration & Styling
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🎯 Comment Porter les Nouveautés</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Mélangez nouvelles pièces avec vos basiques
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Osez les associations couleurs inattendues
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Accessoirisez pour personnaliser votre style
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Adaptez aux occasions : bureau, soirée, weekend
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🌟 Pièces Incontournables</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Blazer oversize : polyvalent et tendance
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Sneakers techniques : confort et style
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Accessoires statement : montres, sacs, bijoux
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  Pièces en matières innovantes : performance et esthétique
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section newsletter nouveautés */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📬 Restez Informé des Nouveautés</h3>
          <p className="text-gray-600 mb-6">
            Soyez les premiers informés de nos nouvelles collections et bénéficiez d'un accès prioritaire
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              S'abonner
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-3">
            🎁 Bonus : -10% sur votre première commande en vous abonnant
          </p>
        </div>

        {/* Preview autres collections */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🔍 Explorez Nos Autres Collections</h3>
          <p className="text-lg opacity-90 mb-6">
            Complétez votre garde-robe avec nos collections permanentes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/homme"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👔 Collection Homme
            </a>
            <a
              href="/femme"
              className="bg-purple-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-900 transition-colors"
            >
              👗 Collection Femme
            </a>
            <a
              href="/accessoires"
              className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-900 transition-colors"
            >
              💎 Accessoires
            </a>
          </div>
        </div>

        {/* Section garanties */}
        <div className="mt-12 bg-gray-800 text-white rounded-xl p-8">
          <h3 className="text-lg font-bold text-center mb-6">✅ Nos Garanties Nouveautés</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">🚚</div>
              <h4 className="font-medium mb-2">Livraison Express</h4>
              <p className="text-sm text-gray-300">Recevez vos nouveautés sous 24-48h</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-medium mb-2">Échange Facile</h4>
              <p className="text-sm text-gray-300">Échangez gratuitement pendant 30 jours</p>
            </div>
            <div>
              <div className="text-2xl mb-2">💯</div>
              <h4 className="font-medium mb-2">Satisfaction Garantie</h4>
              <p className="text-sm text-gray-300">Remboursement si non satisfait</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}