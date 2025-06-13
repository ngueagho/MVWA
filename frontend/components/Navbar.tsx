// components/Navbar.tsx - VERSION PREMIUM AMÉLIORÉE
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Détection du scroll pour effet glassmorphisme
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Vérifier l'authentification
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }

      // Mettre à jour le compteur de panier
      updateCartCount();

      // Écouter les changements de localStorage
      const handleStorageChange = () => {
        updateCartCount();
        const currentToken = localStorage.getItem('auth_token');
        const currentUserData = localStorage.getItem('user_data');
        
        if (currentToken && currentUserData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(currentUserData));
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      const interval = setInterval(() => {
        updateCartCount();
        handleStorageChange();
      }, 1000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
      };
    }
  }, []);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setIsLoggedIn(false);
      setUser(null);
      setIsMenuOpen(false);
      router.push('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navItems = [
    { href: '/homme', label: 'Homme', icon: '👔', color: 'blue' },
    { href: '/femme', label: 'Femme', icon: '👗', color: 'pink' },
    { href: '/accessoires', label: 'Accessoires', icon: '👜', color: 'emerald' },
    { href: '/nouveautes', label: 'Nouveautés', icon: '✨', color: 'purple' },
    { href: '/soldes', label: 'Soldes', icon: '🔥', color: 'red', highlight: true },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-white shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Premium */}
            <div className="flex-shrink-0 group">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-lg">U</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-30 group-hover:opacity-50 blur transition-all duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    UrbanTendance
                  </span>
                  <div className="text-xs text-gray-500 font-medium -mt-1">Style Premium</div>
                </div>
              </Link>
            </div>

            {/* Navigation principale - Desktop */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      item.highlight 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    
                    {/* Effet de survol premium */}
                    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      item.color === 'blue' ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10' :
                      item.color === 'pink' ? 'bg-gradient-to-r from-pink-500/10 to-pink-600/10' :
                      item.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10' :
                      item.color === 'purple' ? 'bg-gradient-to-r from-purple-500/10 to-purple-600/10' :
                      'bg-gradient-to-r from-red-500/10 to-red-600/10'
                    }`}></div>
                    
                    {/* Ligne de survol */}
                    <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 rounded-full group-hover:w-3/4 transition-all duration-300 transform -translate-x-1/2 ${
                      item.color === 'blue' ? 'bg-blue-600' :
                      item.color === 'pink' ? 'bg-pink-600' :
                      item.color === 'emerald' ? 'bg-emerald-600' :
                      item.color === 'purple' ? 'bg-purple-600' :
                      'bg-red-600'
                    }`}></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions à droite */}
            <div className="flex items-center space-x-3">
              
              {/* Barre de recherche premium */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="group relative p-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-xl"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
                </button>
                
                {/* Popup de recherche premium */}
                {isSearchOpen && (
                  <div className="absolute right-0 top-14 w-96 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Recherche Premium</h3>
                      <p className="text-sm text-gray-600">Trouvez votre style parfait</p>
                    </div>
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher un produit, une marque..."
                          className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300"
                          autoFocus
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        Rechercher
                      </button>
                    </form>
                    
                    {/* Suggestions rapides */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Recherches populaires</p>
                      <div className="flex flex-wrap gap-2">
                        {['T-shirts', 'Jeans', 'Sneakers', 'Robes'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              handleSearch({ preventDefault: () => {} });
                            }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Panier premium avec animation */}
              <Link href="/cart" className="group relative p-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-xl">
                <div className="relative">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                  </svg>
                  
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex items-center justify-center h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
              </Link>

              {/* Authentification premium */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group-hover:shadow-lg">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition-all duration-300"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-gray-900">{user?.username}</div>
                      <div className="text-xs text-gray-500">Premium Member</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Menu déroulant premium */}
                  <div className="absolute right-0 top-14 w-64 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user?.username}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        <span className="text-base">👤</span>
                        <span>Mon profil</span>
                      </Link>
                      <Link href="/orders" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                        <span className="text-base">📦</span>
                        <span>Mes commandes</span>
                      </Link>
                      <Link href="/wishlist" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors">
                        <span className="text-base">❤️</span>
                        <span>Ma wishlist</span>
                      </Link>
                      
                      {(user?.username === 'admin' || user?.is_staff || user?.role === 'admin') && (
                        <>
                          <hr className="my-2 mx-4 border-gray-200" />
                          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <span className="text-base">⚙️</span>
                            <span>Administration</span>
                          </Link>
                        </>
                      )}
                    </div>
                    
                    <hr className="my-2 mx-4 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="text-base">🚪</span>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* Menu mobile button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile premium */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/20">
            <div className="px-4 py-6 space-y-4">
              
              {/* Recherche mobile */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Navigation mobile */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center space-x-3 p-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      item.highlight 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Authentification mobile */}
              {isLoggedIn ? (
                <div className="pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user?.username}</div>
                      <div className="text-sm text-gray-500">Premium Member</div>
                    </div>
                  </div>
                  
                  <Link href="/profile" className="flex items-center space-x-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-xl">👤</span>
                    <span>Mon profil</span>
                  </Link>
                  <Link href="/orders" className="flex items-center space-x-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-xl">📦</span>
                    <span>Mes commandes</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center space-x-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-xl">❤️</span>
                    <span>Ma wishlist</span>
                  </Link>
                  
                  {(user?.username === 'admin' || user?.is_staff || user?.role === 'admin') && (
                    <Link href="/admin" className="flex items-center space-x-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <span className="text-xl">⚙️</span>
                      <span>Administration</span>
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center space-x-2 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">🔑</span>
                    <span className="font-medium">Connexion</span>
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">✨</span>
                    <span className="font-medium">S'inscrire</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay pour fermer la recherche */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}