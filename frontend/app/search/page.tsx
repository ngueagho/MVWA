// app/search/page.tsx - PAGE RECHERCHE VULNÉRABLE
'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'relevance'
  })
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    if (q) {
      performSearch(q)
    }
  }, [searchParams])

  // FAILLE: Recherche SQL injectable
  const performSearch = async (searchQuery) => {
    setLoading(true)
    try {
      // FAILLE: Paramètres non échappés dans l'URL
      const response = await fetch(`http://localhost:8000/api/products/search/?q=${searchQuery}&category=${filters.category}&min_price=${filters.priceMin}&max_price=${filters.priceMax}&sort=${filters.sortBy}`)
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        // Fallback avec données simulées
        const mockResults = [
          { id: 1, name: "T-shirt Urbain Premium", price: "45,900", category: "T-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
          { id: 2, name: "Jean Slim Délavé", price: "78,700", category: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
          { id: 3, name: "Hoodie Streetwear", price: "89,500", category: "Sweats", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
          { id: 4, name: "Sneakers High-Top", price: "125,000", category: "Chaussures", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" },
          { id: 5, name: "Casquette Snapback", price: "32,800", category: "Accessoires", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" }
        ]
        
        // Filtrer les résultats selon la recherche
        const filtered = mockResults.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filtered)
      }
    } catch (error) {
      console.error('Erreur recherche:', error)
      toast.error('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  // FAILLE: Suggestions de recherche exposant des données sensibles
  const loadSuggestions = async (input) => {
    if (input.length > 2) {
      try {
        // FAILLE: Requête non sécurisée
        const response = await fetch(`http://localhost:8000/api/search/suggestions/?q=${input}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        // Suggestions simulées
        const mockSuggestions = [
          'T-shirt premium',
          'Jean streetwear',
          'Hoodie oversized',
          'Sneakers limited',
          'Casquette vintage'
        ].filter(s => s.toLowerCase().includes(input.toLowerCase()))
        setSuggestions(mockSuggestions)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      // FAILLE: XSS potentiel dans l'URL
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
      performSearch(query)
    }
  }

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = existingCart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    toast.success(`${product.name} ajouté au panier !`)
  }

  const applyFilters = () => {
    performSearch(query)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'relevance'
    })
    if (query) {
      performSearch(query)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    loadSuggestions(e.target.value)
                  }}
                  placeholder="Rechercher des produits..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  🔍
                </button>
                
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setQuery(suggestion)
                          setSuggestions([])
                          performSearch(suggestion)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Effacer
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les catégories</option>
                    <option value="tshirts">T-shirts</option>
                    <option value="jeans">Jeans</option>
                    <option value="sweats">Sweats</option>
                    <option value="chaussures">Chaussures</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Pertinence</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="name_asc">Nom A-Z</option>
                    <option value="name_desc">Nom Z-A</option>
                    <option value="newest">Plus récent</option>
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Appliquer les filtres
                </button>
              </div>

              {/* FAILLE: Informations de debug exposées */}
              <div className="mt-6 p-3 bg-gray-100 rounded-lg text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Query: {query}</p>
                <p>Results: {results.length}</p>
                <p>User Agent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3">
            {query && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Résultats pour "{query}"
                </h2>
                <p className="text-gray-600 mt-1">
                  {results.length} produit{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length === 0 && query ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez avec d'autres mots-clés ou modifiez vos filtres
                </p>
                <div className="space-x-4">
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Effacer les filtres
                  </button>
                  <Link
                    href="/"
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
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
                      <p className="text-gray-600 mb-3">{product.category}</p>
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
            )}

            {/* Recherches populaires */}
            {!query && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recherches populaires</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'T-shirt premium',
                    'Jean streetwear',
                    'Hoodie oversized',
                    'Sneakers limited',
                    'Casquette vintage',
                    'Veste bomber',
                    'Accessoires urbains',
                    'Collection homme'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term)
                        performSearch(term)
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}