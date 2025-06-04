'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, DocumentArrowDownIcon, TruckIcon } from '@heroicons/react/24/solid'

// Import dynamique de jsPDF
let jsPDF: any
if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default
  })
}

interface CartItem {
  id: number
  name: string
  price: string
  quantity: number
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface LastOrder {
  orderNumber: string
  timestamp: string
  items: CartItem[]
  total: number
  customer: CustomerInfo
  paymentMethod: string
  status: string
}

export default function OrderSuccessPage() {
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadLastOrder()
  }, [])

  const loadLastOrder = () => {
    try {
      const savedOrder = localStorage.getItem('lastOrder')
      if (!savedOrder) {
        // Si pas de commande, rediriger vers l'accueil
        router.push('/')
        return
      }
      setLastOrder(JSON.parse(savedOrder))
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const downloadInvoice = async () => {
    if (!lastOrder) return

    try {
      if (!jsPDF) {
        // Charger jsPDF dynamiquement
        const jsPDFModule = await import('jspdf')
        jsPDF = jsPDFModule.default
      }

      const doc = new jsPDF()
      
      // En-tête de la facture
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246)
      doc.text('UrbanTendance', 20, 30)
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Mode urbaine haut de gamme', 20, 40)
      doc.text('Douala, Cameroun', 20, 47)
      doc.text('contact@urbantendance.com', 20, 54)
      
      // Numéro de facture
      doc.setFontSize(16)
      doc.text(`FACTURE N° ${lastOrder.orderNumber}`, 140, 30)
      
      doc.setFontSize(10)
      doc.text(`Date: ${new Date(lastOrder.timestamp).toLocaleDateString('fr-FR')}`, 140, 40)
      doc.text(`Statut: PAYÉE`, 140, 47)
      
      // Informations client
      doc.setFontSize(12)
      doc.text('FACTURÉ À:', 20, 75)
      doc.setFontSize(10)
      doc.text(`${lastOrder.customer.firstName} ${lastOrder.customer.lastName}`, 20, 85)
      doc.text(lastOrder.customer.email, 20, 92)
      doc.text(lastOrder.customer.phone, 20, 99)
      
      if (lastOrder.customer.address) {
        doc.text(`${lastOrder.customer.address}`, 20, 106)
        doc.text(`${lastOrder.customer.city}, ${lastOrder.customer.postalCode}`, 20, 113)
      }
      doc.text(lastOrder.customer.country, 20, 120)
      
      // Ligne de séparation
      doc.line(20, 135, 190, 135)
      
      // En-têtes du tableau
      doc.setFont(undefined, 'bold')
      doc.text('PRODUIT', 20, 145)
      doc.text('QTÉ', 120, 145)
      doc.text('PRIX UNITAIRE', 140, 145)
      doc.text('TOTAL', 170, 145)
      
      doc.line(20, 150, 190, 150)
      
      // Produits
      doc.setFont(undefined, 'normal')
      let yPosition = 160
      
      lastOrder.items.forEach((item: CartItem) => {
        const itemTotal = parseFloat(item.price.replace(',', '')) * item.quantity
        
        doc.text(item.name, 20, yPosition)
        doc.text(item.quantity.toString(), 125, yPosition)
        doc.text(`${item.price} FCFA`, 140, yPosition)
        doc.text(`${formatPrice(itemTotal)} FCFA`, 170, yPosition)
        
        yPosition += 10
      })
      
      // Totaux
      yPosition += 15
      doc.setFont(undefined, 'bold')
      doc.text('TOTAL FINAL:', 140, yPosition)
      doc.text(`${formatPrice(lastOrder.total)} FCFA`, 170, yPosition)
      
      // Informations de paiement
      yPosition += 20
      doc.setFont(undefined, 'normal')
      doc.text('MODE DE PAIEMENT:', 20, yPosition)
      
      const paymentText = lastOrder.paymentMethod === 'card' ? 'Carte bancaire' : 
                         lastOrder.paymentMethod === 'mobile' ? 'Mobile Money' : 'Paiement à la livraison'
      doc.text(paymentText, 70, yPosition)
      
      doc.save(`Facture_${lastOrder.orderNumber}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande trouvée</h1>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Message de succès */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
        </div>

        {/* Détails de la commande */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Détails de votre commande</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Numéro de commande</p>
              <p className="font-mono font-bold">{lastOrder.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de commande</p>
              <p className="font-semibold">
                {new Date(lastOrder.timestamp).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mode de paiement</p>
              <p className="font-semibold">
                {lastOrder.paymentMethod === 'card' ? 'Carte bancaire' : 
                 lastOrder.paymentMethod === 'mobile' ? 'Mobile Money' : 'Paiement à la livraison'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className="font-semibold text-green-600">✅ Payée</p>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Produits commandés</h3>
            <div className="space-y-3">
              {lastOrder.items.map((item: CartItem, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-bold">
                    {formatPrice(parseFloat(item.price.replace(',', '')) * item.quantity)} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total payé</span>
              <span className="text-green-600">{formatPrice(lastOrder.total)} FCFA</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={downloadInvoice}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Télécharger la facture PDF
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Continuer mes achats
            </Link>
            
            <Link
              href="/compte"
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              Mon compte
            </Link>
          </div>
        </div>

        {/* Informations de livraison */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <TruckIcon className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Informations de livraison</h3>
              <p className="text-blue-700 text-sm mb-2">
                Votre commande sera livrée à l'adresse suivante :
              </p>
              <p className="text-blue-900 font-medium">
                {lastOrder.customer.firstName} {lastOrder.customer.lastName}<br />
                {lastOrder.customer.address && (
                  <>
                    {lastOrder.customer.address}<br />
                    {lastOrder.customer.city}, {lastOrder.customer.postalCode}<br />
                  </>
                )}
                {lastOrder.customer.country}<br />
                {lastOrder.customer.phone}
              </p>
              <p className="text-blue-700 text-sm mt-3">
                <strong>Délai estimé:</strong> 2-5 jours ouvrés
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-600 mb-2">
            Pour toute question concernant votre commande, contactez-nous :
          </p>
          <p className="text-sm">
            📧 support@urbantendance.com<br />
            📞 +237 XXX XXX XXX
          </p>
        </div>
      </div>
    </div>
  )
}