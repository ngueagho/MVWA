// app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products/?featured=true')
      const data = await response.json()
      setFeaturedProducts(data.results || [])
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      id: 1,
      name: 'Streetwear',
      image: '/images/categories/streetwear.jpg',
      href: '/category/streetwear',
      description: 'Style urbain authentique'
    },
    {
      id: 2,
      name: 'Sneakers',
      image: '/images/categories/sneakers.jpg',
      href: '/category/sneakers',
      description: 'Chaussures premium'
    },
    {
      id: 3,
      name: 'Accessoires',
      image: '/images/categories/accessories.jpg',
      href: '/category/accessoires',
      description: 'Finitions parfaites'
    },
    {
      id: 4,
      name: 'Denim',
      image: '/images/categories/denim.jpg',
      href: '/category/denim',
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Urban Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 animate-fade-in">
            <span className="block">Urban</span>
            <span className="block gradient-text">Tendance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light animate-slide-up">
            Découvrez notre collection exclusive de mode urbaine haut de gamme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/nouveautes" className="btn-primary text-lg px-8 py-4">
              Découvrir la Collection
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4">
              Notre Histoire
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Nos Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez nos catégories de vêtements urbains soigneusement sélectionnés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Produits Vedettes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos coups de cœur de la saison
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary text-lg px-8 py-4">
              Voir Tous les Produits
              <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 gradient-primary">
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
              // FAILLE: Pas de validation côté client
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
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