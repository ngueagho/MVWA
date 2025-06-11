// components/ProductCard.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  discount_price?: number
  image: string
  category: string
  rating: number
  reviews_count: number
  is_new?: boolean
  is_sale?: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast.error('Veuillez vous connecter')
        return
      }

      // FAILLE: Pas de validation du token côté client
      const response = await fetch('http://62.171.146.0:8000/api/wishlist/', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.id })
      })

      if (response.ok) {
        setIsWishlisted(!isWishlisted)
        toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      toast.error('Veuillez vous connecter')
      return
    }

    try {
      // FAILLE: Pas de validation côté client
      const response = await fetch('http://62.171.146.0:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      })

      if (response.ok) {
        toast.success('Produit ajouté au panier')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier')
    }
  }

  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden card-hover">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image || '/images/products/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Nouveau
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Actions Hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              disabled={isLoading}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              {isWishlisted ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
            >
              <ShoppingBagIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quick View */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-colors">
              Aperçu rapide
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews_count})</span>
          </div>

          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3">
            {product.category}
          </p>

          <div className="flex items-center gap-2">
            {product.discount_price ? (
              <>
                <span className="text-lg font-bold text-primary-600">
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
      </Link>
    </div>
  )
}