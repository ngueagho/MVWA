// components/ProductGrid.tsx - COMPOSANT RÉUTILISABLE POUR AFFICHER LES PRODUITS
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  inStock: boolean
  featured: boolean
  imageUrl: string
  tags: string
  discount: number
  dateAdded: string
}

interface ProductGridProps {
  category?: string
  featured?: boolean
  limit?: number
  showOutOfStock?: boolean
}

export default function ProductGrid({ 
  category, 
  featured, 
  limit, 
  showOutOfStock = true 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [category, featured])

  const loadProducts = () => {
    try {
      // Charger les produits depuis le localStorage (créés par l'admin)
      const adminProducts = localStorage.getItem('admin_products')
      const publicProducts = localStorage.getItem('public_products')
      
      let allProducts: Product[] = []
      
      if (adminProducts) {
        allProducts = JSON.parse(adminProducts)
      } else if (publicProducts) {
        allProducts = JSON.parse(publicProducts)
      } else {
        // Produits par défaut si aucun produit admin n'existe
        allProducts = getDefaultProducts()
      }

      // Filtrer selon les critères
      let filteredProducts = allProducts

      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category)
      }

      if (featured) {
        filteredProducts = filteredProducts.filter(p => p.featured)
      }

      if (!showOutOfStock) {
        filteredProducts = filteredProducts.filter(p => p.inStock)
      }

      // Limiter le nombre de produits si spécifié
      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit)
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Erreur chargement produits:', error)
      setProducts(getDefaultProducts())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultProducts = (): Product[] => {
    return [
      {
        id: 1,
        name: "T-shirt Urbain Premium",
        description: "T-shirt en coton biologique, coupe moderne",
        price: 25900,
        originalPrice: 29900,
        category: "homme",
        brand: "UrbanTendance",
        inStock: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        tags: "coton,premium,urban",
        discount: 13,
        dateAdded: new Date().toISOString()
      },
      {
        id: 2,
        name: "Jean Slim Fit Designer",
        description: "Jean taille haute, coupe ajustée",
        price: 78700,
        originalPrice: 89900,
        category: "femme",
        brand: "UrbanTendance",
        inStock: true,
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        tags: "jean,slim,femme",
        discount: 12,
        dateAdded: new Date().toISOString()
      },
      {
        id: 3,
        name: "Sneakers Elite Runner",
        description: "Chaussures de sport haut de gamme",
        price: 125000,
        originalPrice: 145000,
        category: "accessoires",
        brand: "UrbanTendance",
        inStock: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        tags: "sport,premium,confort",
        discount: 14,
        dateAdded: new Date().toISOString()
      },
      {
        id: 4,
        name: "Hoodie Oversized",
        description: "Sweat à capuche coupe ample",
        price: 65900,
        originalPrice: 89900,
        category: "nouveautes",
        brand: "UrbanTendance",
        inStock: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        tags: "comfort,oversized,trendy",
        discount: 27,
        dateAdded: new Date().toISOString()
      },
      {
        id: 5,
        name: "Veste Bomber Vintage",
        description: "Veste bomber style rétro",
        price: 45900,
        originalPrice: 89900,
        category: "soldes",
        brand: "UrbanTendance",
        inStock: true,
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        tags: "vintage,bomber,promo",
        discount: 49,
        dateAdded: new Date().toISOString()
      },
      {
        id: 6,
        name: "Robe Urbaine Chic",
        description: "Robe moderne pour toutes occasions",
        price: 95000,
        originalPrice: 120000,
        category: "femme",
        brand: "UrbanTendance",
        inStock: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        tags: "robe,chic,urbain",
        discount: 21,
        dateAdded: new Date().toISOString()
      },
      {
        id: 7,
        name: "Polo Classic Homme",
        description: "Polo en coton piqué, coupe classique",
        price: 35900,
        originalPrice: 45900,
        category: "homme",
        brand: "UrbanTendance",
        inStock: true,
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
        tags: "polo,classic,coton",
        discount: 22,
        dateAdded: new Date().toISOString()
      },
      {
        id: 8,
        name: "Montre Smart Urban",
        description: "Montre connectée style urbain",
        price: 189000,
        originalPrice: 249000,
        category: "accessoires",
        brand: "UrbanTendance",
        inStock: true,
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        tags: "montre,smart,tech",
        discount: 24,
        dateAdded: new Date().toISOString()
      }
    ]
  }

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Ce produit n\'est plus en stock')
      return
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price.toLocaleString(),
      image: product.imageUrl
    }
    
    const existingItem = existingCart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...cartItem, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success(`${product.name} ajouté au panier !`)
  }

  const addToWishlist = (product: Product) => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.imageUrl,
      dateAdded: new Date().toISOString(),
      inStock: product.inStock,
      category: product.category,
      brand: product.brand,
      discount: product.discount
    }
    
    const existingItem = existingWishlist.find((item: any) => item.id === product.id)
    
    if (!existingItem) {
      existingWishlist.push(wishlistItem)
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist))
      toast.success(`${product.name} ajouté à votre wishlist !`)
    } else {
      toast.info('Ce produit est déjà dans votre wishlist')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg animate-pulse h-96"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
           produit disponible
        </h3>
        <p className="text-gray-600">
          {category ? ` produit dans la catégorie "${category}"` : ' produit trouvé'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 space-y-1">
            {product.discount > 0 && (
              <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                -{product.discount}%
              </span>
            )}
            {product.featured && (
              <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                ⭐ Vedette
              </span>
            )}
            {!product.inStock && (
              <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-bold">
                Rupture
              </span>
            )}
          </div>

          {/* Image */}
          <div className="aspect-square relative">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-opacity ${!product.inStock ? 'opacity-60' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Bouton wishlist au survol */}
            <button
              onClick={() => addToWishlist(product)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <span className="text-pink-500">❤️</span>
            </button>
          </div>

          {/* Contenu */}
          <div className="p-4">
            <div className="mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {product.brand}
              </span>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1">
                {product.name}
              </h3>
            </div>
            
            {product.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Prix */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)} FCFA
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)} FCFA
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? '🛒 Ajouter au panier' : '❌ Rupture de stock'}
              </button>
              
              <button
                onClick={() => addToWishlist(product)}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ❤️ Wishlist
              </button>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className="mt-3 flex flex-wrap gap-1">
                {product.tags.split(',').slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}