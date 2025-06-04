'use client'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function HommePage() {
  const products = [
    { id: 1, name: "T-shirt Urbain", price: "23,600", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
    { id: 2, name: "Jean Slim Fit", price: "78,700", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 3, name: "Hoodie Premium", price: "59,000", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
    { id: 4, name: "Casquette Street", price: "29,500", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
    { id: 5, name: "Veste Bomber", price: "131,200", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400" },
    { id: 6, name: "Sneakers Urban", price: "98,400", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" }
  ]

  const addToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = existingCart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success(`${product.name} ajouté au panier !`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Collection Homme</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                <p className="text-gray-600 mb-3">Style urbain moderne</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">{product.price} FCFA</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
