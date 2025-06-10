// app/homme/page.tsx - PAGE HOMME AVEC PRODUITS DYNAMIQUES
'use client'
import { Toaster } from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'

export default function HommePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">👔 Collection Homme</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de vêtements masculins. 
            Style urbain moderne, qualité premium et designs contemporains.
          </p>
        </div>

        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🔥 Offre Spéciale Homme</h2>
          <p className="text-lg opacity-90 mb-4">
            Jusqu'à -30% sur une sélection de produits masculins
          </p>
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Code: HOMME30 • Livraison gratuite dès 75,000 FCFA</span>
          </div>
        </div>

        {/* Produits vedettes de la catégorie homme */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">⭐ Produits Vedettes</h2>
            <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
              Les plus populaires
            </span>
          </div>
          <ProductGrid category="homme" featured={true} />
        </div>

        {/* Tous les produits homme */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🛍️ Tous les Produits Homme</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• Nouveautés chaque semaine</span>
              <span>• Retours gratuits 30 jours</span>
            </div>
          </div>
          <ProductGrid category="homme" showOutOfStock={true} />
        </div>

        {/* Section avantages */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            ✨ Pourquoi choisir UrbanTendance Homme ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👕</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Qualité Premium</h4>
              <p className="text-gray-600 text-sm">
                Matériaux haut de gamme et finitions soignées pour un style durable
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Livraison Rapide</h4>
              <p className="text-gray-600 text-sm">
                Expédition sous 24h et livraison gratuite dès 75,000 FCFA
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Style Unique</h4>
              <p className="text-gray-600 text-sm">
                Designs exclusifs et tendances pour un look authentique
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎯 Trouvez votre style parfait</h3>
          <p className="text-lg opacity-90 mb-6">
            Explorez nos autres collections pour compléter votre garde-robe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/accessoires"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👜 Accessoires
            </a>
            <a
              href="/nouveautes"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              ✨ Nouveautés
            </a>
            <a
              href="/soldes"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              🔥 Soldes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}