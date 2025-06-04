'use client'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function FemmePage() {
  const products = [
    { id: 11, name: "Robe Urbaine", price: "45,900", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400" },
    { id: 12, name: "Jean Skinny", price: "65,600", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" },
    { id: 13, name: "Top Crop", price: "32,800", image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400" },
    { id: 14, name: "Veste Blazer", price: "98,400", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400" },
    { id: 15, name: "Sneakers Rose", price: "78,700", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400" },
    { id: 16, name: "Sac à Main", price: "52,400", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" }
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Collection Femme</h1>
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
                <p className="text-gray-600 mb-3">Style urbain féminin</p>
                <p className="text-2xl font-bold text-pink-600 mb-4">{product.price} FCFA</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
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
