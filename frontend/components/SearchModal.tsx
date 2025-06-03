// components/SearchModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch()
    } else {
      setResults([])
    }
  }, [searchTerm])

  const performSearch = async () => {
    setLoading(true)
    try {
      // FAILLE: Requête directe sans échappement - SQL Injection possible
      const response = await fetch(`http://localhost:8000/api/products/search/?q=${searchTerm}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Erreur de recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // FAILLE: Redirection sans validation
      window.location.href = `/search?q=${searchTerm}`
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Rechercher des produits
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </form>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Recherche en cours...</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <h4 className="font-medium text-gray-900 mb-3">Résultats ({results.length})</h4>
                {results.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {/* FAILLE: Affichage sans échappement HTML - XSS possible */}
                        <span dangerouslySetInnerHTML={{ __html: product.name }}></span>
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        <span dangerouslySetInnerHTML={{ __html: product.description }}></span>
                      </p>
                      <p className="text-sm font-medium text-primary-600">
                        {product.price}€
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchTerm.length > 2 && results.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}