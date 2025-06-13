// app/soldes/page.tsx - PAGE SOLDES AVEC PRODUITS DYNAMIQUES
'use client'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'

export default function SoldesPage() {
  // Produits en soldes avec de nouvelles images
  const soldesProducts = [
    {
      id: 201,
      name: "Leather Jacket Premium",
      originalPrice: "189,900",
      price: "113,940", // -40%
      discount: "-40%",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      category: "soldes",
      featured: true,
      description: "Veste en cuir véritable haut de gamme"
    },
    {
      id: 202,
      name: "Designer Sunglasses",
      originalPrice: "125,600",
      price: "62,800", // -50%
      discount: "-50%",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      category: "soldes",
      featured: true,
      description: "Lunettes de soleil design italien"
    },
    {
      id: 203,
      name: "Premium Winter Coat",
      originalPrice: "234,500",
      price: "70,350", // -70%
      discount: "-70%",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop",
      category: "soldes",
      featured: true,
      description: "Manteau d'hiver premium laine"
    },
    {
      id: 204,
      name: "Casual Chinos",
      originalPrice: "67,800",
      price: "47,460", // -30%
      discount: "-30%",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Pantalon chino casual élégant"
    },
    {
      id: 205,
      name: "Vintage Denim Shirt",
      originalPrice: "78,900",
      price: "39,450", // -50%
      discount: "-50%",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Chemise en jean vintage authentique"
    },
    {
      id: 206,
      name: "Sports Luxury Watch",
      originalPrice: "456,700",
      price: "136,010", // -70%
      discount: "-70%",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Montre sport luxe multifonctions"
    },
    {
      id: 207,
      name: "Elegant Dress Shirt",
      originalPrice: "89,400",
      price: "62,580", // -30%
      discount: "-30%",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Chemise habillée coupe ajustée"
    },
    {
      id: 208,
      name: "Canvas Sneakers",
      originalPrice: "95,300",
      price: "28,590", // -70%
      discount: "-70%",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Baskets toile vintage style"
    },
    {
      id: 209,
      name: "Wool Scarf Luxury",
      originalPrice: "78,500",
      price: "39,250", // -50%
      discount: "-50%",
      image: "https://images.unsplash.com/photo-1544119972-faffa5d0f9b3?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Écharpe laine luxe motifs"
    },
    {
      id: 210,
      name: "Formal Black Shoes",
      originalPrice: "145,800",
      price: "87,480", // -40%
      discount: "-40%",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Chaussures formelles cuir noir"
    },
    {
      id: 211,
      name: "Knit Sweater",
      originalPrice: "112,600",
      price: "33,780", // -70%
      discount: "-70%",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Pull tricot laine mérinos"
    },
    {
      id: 212,
      name: "Casual Belt Leather",
      originalPrice: "56,900",
      price: "39,830", // -30%
      discount: "-30%",
      image: "https://images.unsplash.com/photo-1553901753-5d4ae9d2fe10?w=400&h=400&fit=crop",
      category: "soldes",
      description: "Ceinture cuir casual élégante"
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
  const featuredProducts = soldesProducts.filter(p => p.featured)
  // Tous les produits soldes
  const allProducts = soldesProducts

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">🔥 SOLDES 🔥</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profitez de nos prix exceptionnels ! Jusqu'à -70% sur une sélection 
            de produits premium. Stocks limités, ne ratez pas ces bonnes affaires !
          </p>
        </div>

        {/* Bannière promotionnelle spéciale soldes */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 mb-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">💥 MÉGA SOLDES</h2>
            <p className="text-xl opacity-90 mb-4">
              Jusqu'à -70% • Dernières semaines • Stocks limités
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Code: MEGA70 • Réduction supplémentaire -10%</span>
              </div>
              <div className="bg-yellow-500 text-red-800 rounded-lg px-4 py-2">
                <span className="text-sm font-bold">⏰ Offre limitée dans le temps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compteur de fin de soldes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">⏳ Les soldes se terminent bientôt !</h3>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="bg-red-100 rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-bold text-red-600">15</div>
              <div className="text-xs text-gray-600">Jours</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-bold text-red-600">08</div>
              <div className="text-xs text-gray-600">Heures</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-bold text-red-600">42</div>
              <div className="text-xs text-gray-600">Minutes</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-bold text-red-600">17</div>
              <div className="text-xs text-gray-600">Secondes</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Dépêchez-vous, les meilleures affaires partent en premier !</p>
        </div>

        {/* Produits en soldes vedettes */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">⭐ Meilleures Affaires</h2>
            <span className="text-sm text-white bg-red-600 px-3 py-1 rounded-full animate-pulse">
              Stocks limités !
            </span>
          </div>
          
          {/* Grille des produits vedettes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {product.discount}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-yellow-500 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    🔥 HOT
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 line-through">{product.originalPrice} FCFA</p>
                      <p className="text-2xl font-bold text-red-600">{product.price} FCFA</p>
                    </div>
                    <div className="text-green-600 font-bold text-sm">
                      Économie: {(parseInt(product.originalPrice.replace(',', '')) - parseInt(product.price.replace(',', ''))).toLocaleString()} FCFA
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fallback vers ProductGrid dynamique */}
          <ProductGrid category="soldes" featured={true} />
        </div>

        {/* Tous les produits en soldes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🏷️ Tous les Produits en Soldes</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• Prix déjà barrés</span>
              <span>• Réductions cumulables</span>
            </div>
          </div>
          
          {/* Grille de tous les produits */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {allProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {product.discount}
                  </span>
                </div>
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
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 line-through">{product.originalPrice} FCFA</p>
                    <p className="text-lg font-bold text-red-600">{product.price} FCFA</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fallback vers ProductGrid dynamique */}
          <ProductGrid category="soldes" showOutOfStock={true} />
        </div>

        {/* Types de réductions */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            🎯 Types de Réductions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl mb-2">🏷️</div>
              <h4 className="font-semibold text-red-700 mb-2">-30%</h4>
              <p className="text-sm text-gray-600">Réductions standards sur toute la collection</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl mb-2">💥</div>
              <h4 className="font-semibold text-orange-700 mb-2">-50%</h4>
              <p className="text-sm text-gray-600">Déstockage sur les collections précédentes</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-yellow-700 mb-2">-70%</h4>
              <p className="text-sm text-gray-600">Liquidation totale • Dernières pièces</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl mb-2">🎁</div>
              <h4 className="font-semibold text-green-700 mb-2">2ème à -80%</h4>
              <p className="text-sm text-gray-600">Offres spéciales sur achats multiples</p>
            </div>
          </div>
        </div>

        {/* Conseils pour les soldes */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            💡 Nos Conseils Soldes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🛍️ Comment Bien Acheter</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Vérifiez les tailles disponibles avant de commander
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Lisez attentivement les conditions de retour
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Comparez les prix avec le prix initial
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Commandez rapidement, les stocks s'épuisent vite
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🎯 Stratégie Gagnante</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Priorisez les pièces intemporelles
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Investissez dans la qualité plutôt que la quantité
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Profitez des codes promo cumulables
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  Ajoutez à votre wishlist pour surveiller les prix
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditions des soldes */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">📋 Conditions des Soldes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">✅</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Retours Acceptés</h4>
              <p className="text-sm text-gray-600">Retours possibles sous 14 jours pour les articles soldés</p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Livraison Maintenue</h4>
              <p className="text-sm text-gray-600">Livraison gratuite maintenue dès 50,000 FCFA d'achats</p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💳</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paiement Sécurisé</h4>
              <p className="text-sm text-gray-600">Tous les moyens de paiement acceptés, transaction sécurisée</p>
            </div>
          </div>
        </div>

        {/* Call to action final */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🏃‍♂️ Dernière Chance !</h3>
          <p className="text-lg opacity-90 mb-6">
            Ne laissez pas passer ces prix exceptionnels. Nos soldes se terminent bientôt !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/homme"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👔 Soldes Homme
            </a>
            <a
              href="/femme"
              className="bg-pink-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-800 transition-colors"
            >
              👗 Soldes Femme
            </a>
            <a
              href="/accessoires"
              className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
            >
              💎 Accessoires Soldés
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}