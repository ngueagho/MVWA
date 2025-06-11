// components/ApiStatus.tsx - Composant pour afficher le statut de l'API Django
'use client'
import { useState, useEffect } from 'react'
import urbanAPI from '../utils/api'

export default function ApiStatus() {
  const [status, setStatus] = useState({
    connected: false,
    testing: true,
    lastCheck: null,
    error: null,
    baseURL: ''
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkApiStatus()
    
    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkApiStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const checkApiStatus = async () => {
    try {
      const apiStatus = await urbanAPI.getApiStatus()
      setStatus({
        connected: apiStatus.connected,
        testing: false,
        lastCheck: new Date().toLocaleTimeString(),
        error: apiStatus.error || null,
        baseURL: apiStatus.baseURL
      })
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        connected: false,
        testing: false,
        error: error.message,
        lastCheck: new Date().toLocaleTimeString()
      }))
    }
  }

  const getStatusColor = () => {
    if (status.testing) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (status.connected) return 'bg-green-100 text-green-800 border-green-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getStatusIcon = () => {
    if (status.testing) return '🔄'
    if (status.connected) return '🟢'
    return '🔴'
  }

  const getStatusText = () => {
    if (status.testing) return 'Test en cours...'
    if (status.connected) return 'Django API Connectée'
    return 'Django API Déconnectée'
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div 
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all duration-300 ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className="mr-2">{getStatusIcon()}</span>
        <span>{getStatusText()}</span>
        <span className="ml-2 text-xs">▼</span>
      </div>

      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-semibold text-gray-900">🔗 Statut API Django</h4>
              <button
                onClick={checkApiStatus}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                🔄 Actualiser
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-600">Statut:</p>
                <p className={`font-medium ${status.connected ? 'text-green-600' : 'text-red-600'}`}>
                  {status.connected ? 'Connectée ✅' : 'Déconnectée ❌'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Dernière vérif:</p>
                <p className="font-medium text-gray-900">{status.lastCheck || 'Jamais'}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-xs">URL de base:</p>
              <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                {status.baseURL || urbanAPI.baseURL || 'Non définie'}
              </p>
            </div>

            {status.error && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-red-800 text-xs font-medium">❌ Erreur:</p>
                <p className="text-red-600 text-xs">{status.error}</p>
              </div>
            )}

            <div className="border-t pt-2">
              <p className="text-gray-600 text-xs mb-2">🔧 Actions rapides:</p>
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    try {
                      const result = await urbanAPI.testConnection()
                      if (result) {
                        alert('✅ Connexion API réussie!')
                      } else {
                        alert('❌ Impossible de se connecter à l\'API')
                      }
                    } catch (error) {
                      alert(`❌ Erreur: ${error.message}`)
                    }
                  }}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                >
                  🧪 Test
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const debug = await urbanAPI.getDebugInfo()
                      console.log('🔍 Debug Info:', debug)
                      alert('🔍 Infos debug récupérées - voir console')
                    } catch (error) {
                      alert(`❌ Erreur debug: ${error.message}`)
                    }
                  }}
                  className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                >
                  🔍 Debug
                </button>

                {status.connected && (
                  <button
                    onClick={async () => {
                      try {
                        await urbanAPI.createTestData()
                        alert('🎯 Données de test créées!')
                      } catch (error) {
                        alert(`❌ Erreur: ${error.message}`)
                      }
                    }}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                  >
                    🎯 Test Data
                  </button>
                )}
              </div>
            </div>

            {/* Informations sur l'authentification */}
            <div className="border-t pt-2">
              <p className="text-gray-600 text-xs mb-1">👤 Authentification:</p>
              <div className="text-xs">
                {urbanAPI.isAuthenticated() ? (
                  <div className="space-y-1">
                    <p className="text-green-600 font-medium">✅ Connecté</p>
                    <p className="text-gray-600">
                      Utilisateur: {urbanAPI.getCurrentUser()?.username || 'Inconnu'}
                    </p>
                    <p className="text-gray-600">
                      Type: {urbanAPI.isAdmin() ? 'Admin' : 'Utilisateur'}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-600 font-medium">❌ Non connecté</p>
                )}
              </div>
            </div>

            {/* FAILLE: Informations sensibles exposées */}
            <div className="border-t pt-2 bg-red-50 rounded p-2">
              <p className="text-red-800 text-xs font-medium">🚨 FAILLE - Info Debug:</p>
              <div className="text-xs text-red-600 space-y-1">
                <p>Token: {localStorage.getItem('auth_token')?.substring(0, 20) || 'Aucun'}...</p>
                <p>Session: {Math.random().toString(36).substring(7)}</p>
                <p>Endpoints vulnérables: /admin/execute-sql/, /.env</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowDetails(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕ Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}