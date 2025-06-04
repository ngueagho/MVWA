'use client'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function SoldesPage() {
  const products = [
    { id: 41, name: "T-shirt Basic", price: "13,100", oldPrice: "26,200", discount: 50, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
    { id: 42, name: "Jean Vintage", price: "39,400", oldPrice: "78,700", discount: 50, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 43, name: "Sweat Confort", price: "29,500", oldPrice: "59,000", discount: 50, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
    { id: 44, name: "Sneakers Retro", price: "52,400", oldPrice: "104,800", discount: 50, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" },
    { id: 45, name: "Veste Légère", price: "65,600", oldPrice: "131,200", discount: 50, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400" },
    { id: 46, name: "Accessoire Set", price: "19,700", oldPrice: "39,400", discount: 50, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" }
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
        <h1 className="text-4xl font-bold text-center mb-8 text-red-600">🔥 SOLDES 🔥</h1>
        <p className="text-center text-gray-600 mb-8">Jusqu'à -50% sur une sélection de produits</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                -{product.discount}%
              </span>
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
                <p className="text-gray-600 mb-3">Prix réduit exceptionnel</p>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-2xl font-bold text-red-600">{product.price} FCFA</p>
                  <p className="text-lg text-gray-500 line-through">{product.oldPrice} FCFA</p>
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
      </div>
    </div>
  )
}
