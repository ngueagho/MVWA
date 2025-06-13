// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4">UrbanTendance</h3>
            <p className="text-gray-400">Mode urbaine haut de gamme</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Boutique</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/homme">Homme</Link></li>
              <li><Link href="/femme">Femme</Link></li>
              <li><Link href="/accessoires">Accessoires</Link></li>
              <li><Link href="/nouveautes">Nouveautés</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/livraison">Livraison</Link></li>
              <li><Link href="/retours">Retours</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/cgv">CGV</Link></li>
              <li><Link href="/confidentialite">Confidentialité</Link></li>
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TIONDONG ROBERTO UrbanTendance. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}