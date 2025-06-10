
// ============================================
// 2. COMPOSANT DE STATUT API: components/ApiStatus.tsx
// ============================================

// components/ApiStatus.tsx - Nouveau composant
'use client'
import { useState, useEffect } from 'react'

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState({ connected: false, loading: true })

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats/')
      setApiStatus({ 
        connected: response.ok, 
        loading: false,
        message: response.ok ? 'API Django connectée' : 'API Django déconnectée'
      })
    } catch (error) {
      setApiStatus({ 
        connected: false, 
        loading: false,
        message: 'API Django inaccessible - Mode localStorage'
      })
    }
  }

  if (apiStatus.loading) return null

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium ${
      apiStatus.connected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          apiStatus.connected ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
        {apiStatus.message}
      </div>
    </div>
  )
}
