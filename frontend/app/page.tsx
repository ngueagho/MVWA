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
      const response = await fetch('http://localhost:8000/api/products/')
      const data = await response.json()
      console.log('API Response:', data) // Pour debug
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      // Fallback avec des produits de démonstration
      setFeaturedProducts([
        { id: 1, name: "Hoodie Urban Premium", price: 89.99, category: "Streetwear" },
        { id: 2, name: "Sneakers Elite Runner", price: 159.99, discount_price: 129.99, category: "Sneakers" },
        { id: 3, name: "Jean Slim Premium", price: 120.00, category: "Denim" },
        { id: 4, name: "Casquette Street", price: 45.00, category: "Accessoires" },
        { id: 5, name: "T-shirt Graphique", price: 35.99, category: "Streetwear" },
        { id: 6, name: "Sac Urban", price: 79.99, category: "Accessoires" },
        { id: 7, name: "Veste Bomber", price: 199.99, discount_price: 149.99, category: "Streetwear" },
        { id: 8, name: "Baskets High-Top", price: 189.99, category: "Sneakers" }
      ])
    } finally {
      setLoading(false)
    }
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
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="block">Urban</span>
            <span className="block text-white">Tendance</span>
          </h1>
          <p className="hero-subtitle">
            Découvrez notre collection exclusive de mode urbaine haut de gamme
          </p>
          <div className="hero-buttons">
            <Link href="/nouveautes" className="btn-primary">
              Découvrir la Collection
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/about" className="btn-secondary">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-500 font-medium"
                  >
                    {product.name?.split(' ')[0] || 'Produit'}
                  </div>
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
