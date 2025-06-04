'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { CreditCardIcon, TruckIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

// Import jsPDF dynamique pour éviter les erreurs SSR
let jsPDF: any = null
if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default
  })
}

interface OrderData {
  items: CartItem[]
  total: number
  timestamp: string
  orderNumber: string
}

interface CartItem {
  id: number
  name: string
  price: string
  image?: string
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

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Cameroun'
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = () => {
    try {
      const savedOrder = localStorage.getItem('currentOrder')
      if (!savedOrder) {
        toast.error('Aucune commande trouvée')
        router.push('/cart')
        return
      }
      setOrderData(JSON.parse(savedOrder))
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error)
      toast.error('Erreur lors du chargement de la commande')
      router.push('/cart')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const generatePDFReceipt = async (finalOrderData: OrderData & { customer: CustomerInfo, paymentMethod: string }) => {
    try {
      // S'assurer que jsPDF est chargé
      if (!jsPDF) {
        const jsPDFModule = await import('jspdf')
        jsPDF = jsPDFModule.default
      }

      const doc = new jsPDF()
      
      // En-tête de la facture
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246) // Bleu
      doc.text('UrbanTendance', 20, 30)
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Mode urbaine haut de gamme', 20, 40)
      doc.text('Douala, Cameroun', 20, 47)
      doc.text('contact@urbantendance.com', 20, 54)
      
      // Numéro de facture
      doc.setFontSize(16)
      doc.text(`FACTURE N° ${finalOrderData.orderNumber}`, 140, 30)
      
      doc.setFontSize(10)
      doc.text(`Date: ${new Date(finalOrderData.timestamp).toLocaleDateString('fr-FR')}`, 140, 40)
      doc.text(`Heure: ${new Date(finalOrderData.timestamp).toLocaleTimeString('fr-FR')}`, 140, 47)
      
      // Informations client
      doc.setFontSize(12)
      doc.text('FACTURÉ À:', 20, 75)
      doc.setFontSize(10)
      doc.text(`${finalOrderData.customer.firstName} ${finalOrderData.customer.lastName}`, 20, 85)
      doc.text(finalOrderData.customer.email, 20, 92)
      doc.text(finalOrderData.customer.phone, 20, 99)
      
      if (finalOrderData.customer.address) {
        doc.text(`${finalOrderData.customer.address}`, 20, 106)
      }
      if (finalOrderData.customer.city && finalOrderData.customer.postalCode) {
        doc.text(`${finalOrderData.customer.city}, ${finalOrderData.customer.postalCode}`, 20, 113)
      }
      doc.text(finalOrderData.customer.country, 20, 120)
      
      // Ligne de séparation
      doc.line(20, 135, 190, 135)
      
      // En-têtes du tableau
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('PRODUIT', 20, 145)
      doc.text('QTÉ', 120, 145)
      doc.text('PRIX UNITAIRE', 140, 145)
      doc.text('TOTAL', 170, 145)
      
      doc.line(20, 150, 190, 150)
      
      // Produits
      doc.setFont(undefined, 'normal')
      let yPosition = 160
      
      finalOrderData.items.forEach((item: CartItem) => {
        const itemPrice = parseFloat(item.price.replace(',', ''))
        const itemTotal = itemPrice * item.quantity
        
        doc.text(item.name.substring(0, 30), 20, yPosition) // Limiter la longueur
        doc.text(item.quantity.toString(), 125, yPosition)
        doc.text(`${item.price} FCFA`, 140, yPosition)
        doc.text(`${formatPrice(itemTotal)} FCFA`, 170, yPosition)
        
        yPosition += 10
      })
      
      // Ligne de séparation
      doc.line(20, yPosition + 5, 190, yPosition + 5)
      
      // Totaux
      yPosition += 15
      doc.setFont(undefined, 'bold')
      doc.text('SOUS-TOTAL:', 140, yPosition)
      doc.text(`${formatPrice(finalOrderData.total)} FCFA`, 170, yPosition)
      
      yPosition += 10
      doc.text('LIVRAISON:', 140, yPosition)
      doc.text('GRATUITE', 170, yPosition)
      
      yPosition += 10
      doc.setFontSize(12)
      doc.text('TOTAL FINAL:', 140, yPosition)
      doc.text(`${formatPrice(finalOrderData.total)} FCFA`, 170, yPosition)
      
      // Informations de paiement
      yPosition += 20
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text('MODE DE PAIEMENT:', 20, yPosition)
      
      const paymentText = finalOrderData.paymentMethod === 'card' ? 'Carte bancaire' : 
                         finalOrderData.paymentMethod === 'mobile' ? 'Mobile Money' : 'Paiement à la livraison'
      doc.text(paymentText, 70, yPosition)
      
      // Note de remerciement
      yPosition += 20
      doc.setTextColor(100, 100, 100)
      doc.text('Merci pour votre achat chez UrbanTendance !', 20, yPosition)
      doc.text('Pour toute question, contactez-nous: +237 XXX XXX XXX', 20, yPosition + 7)
      
      // FAILLE VOLONTAIRE: Exposer des informations sensibles dans le PDF
      yPosition += 20
      doc.setFontSize(8)
      doc.setTextColor(200, 200, 200)
      doc.text('Debug Info (DEV ONLY): customer_id=' + Math.floor(Math.random() * 1000), 20, yPosition)
      doc.text('Internal Order ID: ' + finalOrderData.orderNumber + '_' + Date.now(), 20, yPosition + 5)
      
      return doc
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      throw error
    }
  }

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderData) {
      toast.error('Données de commande manquantes')
      return
    }
    
    // Validation basique
    if (!customerInfo.firstName || !customerInfo.email || !customerInfo.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setProcessing(true)

    try {
      // Simulation du traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Données finales de la commande
      const finalOrderData = {
        ...orderData,
        customer: customerInfo,
        paymentMethod,
        status: 'paid',
        paidAt: new Date().toISOString()
      }

      // FAILLE VOLONTAIRE: Stocker des données sensibles en local storage
      localStorage.setItem('lastOrder', JSON.stringify({
        ...finalOrderData,
        customerCreditCard: '4532-1234-5678-9012', // Données sensibles
        internalNotes: 'Customer IP: 192.168.1.100, Browser: Chrome',
        adminToken: 'admin_' + Math.random().toString(36).substr(2, 9)
      }))

      try {
        // Générer et télécharger le PDF
        const pdf = await generatePDFReceipt(finalOrderData)
        pdf.save(`Facture_${finalOrderData.orderNumber}.pdf`)
        toast.success('Paiement effectué avec succès ! Votre facture PDF a été téléchargée.')
      } catch (pdfError) {
        console.error('Erreur PDF:', pdfError)
        toast.success('Paiement effectué avec succès ! (Erreur génération PDF)')
      }
      
      // Vider le panier
      localStorage.removeItem('cart')
      localStorage.removeItem('currentOrder')
      
      // Rediriger vers une page de confirmation
      setTimeout(() => {
        router.push('/order-success')
      }, 2000)
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      toast.error('Erreur lors du traitement du paiement')
    } finally {
      setProcessing(false)
    }
  }

  const downloadReceiptAgain = async () => {
    if (orderData) {
      const finalOrderData = {
        ...orderData,
        customer: customerInfo,
        paymentMethod,
        status: 'paid',
        paidAt: new Date().toISOString()
      }
      
      try {
        const pdf = await generatePDFReceipt(finalOrderData)
        pdf.save(`Facture_${finalOrderData.orderNumber}.pdf`)
        toast.success('Facture PDF téléchargée !')
      } catch (error) {
        console.error('Erreur génération PDF:', error)
        toast.error('Erreur lors de la génération du PDF')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h1>
          <button
            onClick={() => router.push('/cart')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour au panier
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TruckIcon className="w-6 h-6 mr-2" />
                Informations de livraison
              </h2>
              
              <form onSubmit={processPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="+237 XXX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Méthode de paiement */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Mode de paiement
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>💳 Carte bancaire</span>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="mobile"
                        checked={paymentMethod === 'mobile'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>📱 Mobile Money (MTN/Orange)</span>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>💵 Paiement à la livraison</span>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Traitement en cours...
                    </div>
                  ) : (
                    '🚀 Finaliser la commande'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Résumé de commande */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">📋 Résumé de commande</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Commande N°</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{orderData.orderNumber}</span>
                </div>
                
                <div className="border-t pt-3">
                  {orderData.items.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-sm font-medium">
                        {formatPrice(parseFloat(item.price.replace(',', '')) * item.quantity)} FCFA
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(orderData.total)} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">✅ Gratuite</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">{formatPrice(orderData.total)} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Bouton de téléchargement de facture */}
                <button
                  type="button"
                  onClick={downloadReceiptAgain}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  📄 Télécharger facture PDF
                </button>

                {/* Informations de livraison */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">🚚 Livraison gratuite</h3>
                  <p className="text-sm text-green-700">
                    Livraison gratuite dans tout le Cameroun.<br />
                    <strong>Délai estimé:</strong> 2-5 jours ouvrés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}