// app/layout.tsx
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'UrbanTendance - Mode Urbaine Haut de Gamme',
  description: 'Découvrez notre collection exclusive de vêtements urbains haut de gamme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.className} ${playfair.variable}`}>
      <head>
        {/* FAILLE: Pas de CSP défini */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Fallback Tailwind CDN si la compilation échoue */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!document.querySelector('style[data-tailwind]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.tailwindcss.com';
                document.head.appendChild(link);
              }
            `
          }}
        />
      </head>
      <body style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: '4rem' }}>
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}