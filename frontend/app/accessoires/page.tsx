// app/accessoires/page.tsx - PAGE ACCESSOIRES AVEC PRODUITS DYNAMIQUES
'use client'
import { Toaster } from 'react-hot-toast'
import ProductGrid from '../../components/ProductGrid'

export default function AccessoiresPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">👜 Collection Accessoires</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complétez votre style avec notre sélection d'accessoires premium. 
            Montres, bijoux, sacs et bien plus pour parfaire votre look.
          </p>
        </div>

        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">💎 Accessoires Premium</h2>
          <p className="text-lg opacity-90 mb-4">
            L'élégance dans les détails • Qualité exceptionnelle
          </p>
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Code: ACCESS15 • -15% sur tous les accessoires</span>
          </div>
        </div>

        {/* Produits vedettes accessoires */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">⭐ Accessoires Vedettes</h2>
            <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
              Sélection premium
            </span>
          </div>
          <ProductGrid category="accessoires" featured={true} />
        </div>

        {/* Tous les accessoires */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">✨ Tous les Accessoires</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>• Livraison soignée</span>
              <span>• Garantie qualité</span>
            </div>
          </div>
          <ProductGrid category="accessoires" showOutOfStock={true} />
        </div>

        {/* Guide des accessoires */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            💍 Guide des Accessoires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⌚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Montres</h4>
              <p className="text-gray-600 text-sm">
                Montres classiques et connectées pour toutes les occasions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👜</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Maroquinerie</h4>
              <p className="text-gray-600 text-sm">
                Sacs, portefeuilles et accessoires en cuir de qualité
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bijoux</h4>
              <p className="text-gray-600 text-sm">
                Bijoux tendance et intemporels pour homme et femme
              </p>
            </div>
          </div>
        </div>

        {/* Section entretien */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            🧼 Conseils d'Entretien
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">💍 Bijoux & Montres</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Nettoyer délicatement avec un chiffon doux
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Éviter le contact avec les parfums
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Ranger dans des boîtes séparées
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Service après-vente disponible
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">👜 Maroquinerie</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Traitement du cuir avec des produits spécialisés
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Protection contre l'humidité excessive
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Stockage dans un endroit aéré
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  Réparations possibles en atelier
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-green-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎁 Idées Cadeaux</h3>
          <p className="text-lg opacity-90 mb-6">
            Nos accessoires font de parfaits cadeaux pour vos proches
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/femme"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              👗 Pour Elle
            </a>
            <a
              href="/homme"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              👔 Pour Lui
            </a>
            <a
              href="/contact"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              💬 Conseil Personnel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}