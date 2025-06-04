'use client'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function NouveautesPage() {
  const products = [
    { id: 31, name: "Veste Tech Future", price: "164,000", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400", isNew: true },
    { id: 32, name: "Sneakers Hologram", price: "131,200", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", isNew: true },
    { id: 33, name: "Hoodie LED", price: "98,400", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", isNew: true },
    { id: 34, name: "Jean Smart Fabric", price: "85,200", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", isNew: true },
    { id: 35, name: "Casquette NFC", price: "52,400", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", isNew: true },
    { id: 36, name: "Sac Connecté", price: "118,000", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", isNew: true }
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
        <h1 className="text-4xl font-bold text-center mb-8">Nouveautés</h1>
        <p className="text-center text-gray-600 mb-8">Découvrez nos dernières arrivées tech</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              {product.isNew && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                  NOUVEAU
                </span>
              )}
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
                <p className="text-gray-600 mb-3">Technologie de pointe</p>
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
      </div>
    </div>
  )
}
