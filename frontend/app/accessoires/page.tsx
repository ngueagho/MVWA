'use client'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function AccessoiresPage() {
  const products = [
    { id: 21, name: "Montre Smart", price: "131,200", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 22, name: "Lunettes Style", price: "39,400", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
    { id: 23, name: "Casquette Premium", price: "29,500", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
    { id: 24, name: "Ceinture Cuir", price: "45,900", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { id: 25, name: "Portefeuille", price: "26,200", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400" },
    { id: 26, name: "Collier Urban", price: "19,700", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
    { id: 27, name: "Bracelet Style", price: "16,400", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400" },
    { id: 28, name: "Bague Design", price: "13,100", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400" }
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
        <h1 className="text-4xl font-bold text-center mb-8">Accessoires</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                <p className="text-gray-600 mb-2 text-sm">Accessoire premium</p>
                <p className="text-lg font-bold text-green-600 mb-3">{product.price} FCFA</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
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
