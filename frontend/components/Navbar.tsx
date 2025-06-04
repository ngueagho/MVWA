// components/Navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBagIcon, UserIcon, HeartIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fix SSR - window n'est disponible que côté client
  useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    // Initial check
    checkMobile()
    
    // Event listeners
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (mounted) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // FAILLE: Pas de validation du token côté client
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setUser(payload)
        } catch (error) {
          console.error('Token invalide')
        }
      }
    }
  }, [mounted])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Homme', href: '/homme' },
    { name: 'Femme', href: '/femme' },
    { name: 'Accessoires', href: '/accessoires' },
    { name: 'Nouveautés', href: '/nouveautes' },
    { name: 'Soldes', href: '/soldes' },
  ]

  const handleLogout = () => {
    if (mounted) {
      localStorage.removeItem('auth_token')
      setUser(null)
      router.push('/')
    }
  }

  // Ne pas render avant que le composant soit monté côté client
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold gradient-text font-display">
                UrbanTendance
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold gradient-text font-display">
                  UrbanTendance
                </span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            {!isMobile && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Recherche */}
              <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-300">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-300"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>

              {/* Panier */}
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-300 relative"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Utilisateur */}
              {user ? (
                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-300">
                    <UserIcon className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mon Profil
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mes Commandes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary text-sm"
                >
                  Connexion
                </Link>
              )}

              {/* Menu Mobile */}
              {isMobile && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-300"
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}