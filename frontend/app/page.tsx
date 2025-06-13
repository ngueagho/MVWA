'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://62.171.146.0:8000/api/products/')
      const data = await response.json()
      console.log('API Response:', data) // Pour debug
      
      // Vérification que data est bien un tableau
      if (Array.isArray(data)) {
        setFeaturedProducts(data)
      } else if (data && Array.isArray(data.results)) {
        // Au cas où l'API renvoie un objet avec une propriété results
        setFeaturedProducts(data.results)
      } else {
        // Si ce n'est pas un tableau, utiliser le fallback
        throw new Error('Data is not an array')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      // Fallback avec des produits de démonstration incluant des images toutes différentes
      setFeaturedProducts([
        { 
          id: 1, 
          name: "Hoodie Urban Premium", 
          price: 89.99, 
          category: "Streetwear",
          image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop"
        },
        { 
          id: 2, 
          name: "Sneakers Elite Runner", 
          price: 159.99, 
          discount_price: 129.99, 
          category: "Sneakers",
          image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop"
        },
        { 
          id: 3, 
          name: "Jean Slim Premium", 
          price: 120.00, 
          category: "Denim",
          image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop"
        },
        { 
          id: 4, 
          name: "Casquette Street", 
          price: 45.00, 
          category: "Accessoires",
          image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop"
        },
        { 
          id: 5, 
          name: "T-shirt Graphique", 
          price: 35.99, 
          category: "Streetwear",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
        },
        { 
          id: 6, 
          name: "Sac Urban", 
          price: 79.99, 
          category: "Accessoires",
          image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
        },
        { 
          id: 7, 
          name: "Veste Bomber", 
          price: 199.99, 
          discount_price: 149.99, 
          category: "Streetwear",
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
        },
        { 
          id: 8, 
          name: "Baskets High-Top", 
          price: 189.99, 
          category: "Sneakers",
          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour générer une image par défaut basée sur la catégorie avec plus de variété
  const getDefaultImage = (category, productName) => {
    const categoryImages = {
      'Streetwear': [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'
      ],
      'Sneakers': [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop'
      ],
      'Denim': [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
      ],
      'Accessoires': [
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506629905962-c5f0bee5a7b0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop'
      ]
    }
    
    const images = categoryImages[category] || ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop']
    return images[Math.floor(Math.random() * images.length)]
  }

  const categories = [
    {
      id: 1,
      name: 'Streetwear',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      href: '/streetwear',
      description: 'Style urbain authentique'
    },
    {
      id: 2,
      name: 'Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      href: '/sneakers',
      description: 'Chaussures premium'
    },
    {
      id: 3,
      name: 'Accessoires',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      href: '/accessoires',
      description: 'Finitions parfaites'
    },
    {
      id: 4,
      name: 'Denim',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      href: '/denim',
      description: 'Jeans haut de gamme'
    }
  ]

  const features = [
    {
      icon: TruckIcon,
      title: 'Livraison Gratuite',
      description: 'Livraison offerte dès 99€ d\'achat'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Retours Gratuits',
      description: '30 jours pour changer d\'avis'
    },
    {
      icon: CreditCardIcon,
      title: 'Paiement Sécurisé',
      description: 'Vos données sont protégées'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="Urban Fashion Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/70 to-blue-800/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            <span className="block text-white">Urban</span>
            <span className="block text-white">Tendance</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez notre collection exclusive de mode urbaine haut de gamme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nouveautes" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Découvrir la Collection
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm">
              Notre Histoire
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Nos Collections</h2>
            <p className="section-description">
              Explorez nos catégories de vêtements urbains soigneusement sélectionnés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={category.href} className="group relative overflow-hidden rounded-2xl card-hover">
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold font-display">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-gray-50">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Produits Vedettes</h2>
            <p className="section-description">
              Découvrez nos coups de cœur de la saison
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image relative overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <Image
                        src={getDefaultImage(product.category, product.name)}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    )}
                    {product.discount_price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="flex items-center gap-2">
                      {product.discount_price ? (
                        <>
                          <span className="text-lg font-bold text-blue-600">
                            {product.discount_price}€
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {product.price}€
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {product.price}€
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/nouveautes" className="btn-primary">
              Voir Tous les Produits
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-display text-white mb-4">
            Restez Connecté
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Inscrivez-vous à notre newsletter pour être informé des dernières tendances
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}