// frontend/app/checkout/page.tsx - CODE COMPLET
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Douala',
    paymentMethod: 'card'
  });
  
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/,/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const generateInvoiceNumber = () => {
    return `UT-${Date.now().toString().slice(-8)}`;
  };

  // GÉNÉRATEUR DE BELLE FACTURE PDF COMPLET
  const generateBeautifulInvoice = async (orderData) => {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      const doc = new jsPDF('p', 'mm', 'a4');
      
      // === HEADER AVEC DÉGRADÉ ===
      doc.setFillColor(59, 130, 246); // Bleu primary
      doc.rect(0, 0, 210, 60, 'F');
      
      doc.setFillColor(139, 92, 246); // Violet accent
      doc.rect(0, 50, 210, 10, 'F');

      // Logo et nom de l'entreprise
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text('UrbanTendance', 20, 25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Mode urbaine haut de gamme', 20, 35);
      doc.text('Douala, Cameroun', 20, 42);
      doc.text('contact@urbantendance.com', 20, 49);

      // Numéro de facture (coin droit)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURE', 160, 20);
      
      doc.setFontSize(18);
      doc.text(`N° ${orderData.invoiceNumber}`, 160, 30);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${orderData.date}`, 160, 40);
      doc.text('Statut: PAYÉE', 160, 47);

      // === INFORMATIONS CLIENT ===
      doc.setTextColor(31, 41, 55); // Gris foncé
      doc.setFillColor(248, 250, 252); // Fond gris clair
      doc.rect(20, 75, 170, 35, 'F');
      
      // Bordure gauche colorée
      doc.setFillColor(99, 102, 241); // Indigo
      doc.rect(20, 75, 3, 35, 'F');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURÉ À:', 30, 85);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(orderData.customer.name, 30, 95);
      doc.text(orderData.customer.email, 30, 102);
      doc.text(orderData.customer.phone, 30, 109);
      doc.text(`${orderData.customer.address}, ${orderData.customer.city}`, 30, 116);

      // === TABLEAU DES PRODUITS MODERNE ===
      let yPos = 130;
      
      // En-tête du tableau avec style moderne
      doc.setFillColor(59, 130, 246); // Bleu primary
      doc.rect(20, yPos, 170, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('PRODUIT', 25, yPos + 8);
      doc.text('QTÉ', 120, yPos + 8);
      doc.text('PRIX UNITAIRE', 135, yPos + 8);
      doc.text('TOTAL', 170, yPos + 8);

      yPos += 12;

      // Lignes de produits avec alternance de couleurs
      orderData.items.forEach((item, index) => {
        // Fond alterné
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(20, yPos, 170, 15, 'F');
        }

        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Nom du produit (en gras)
        doc.setFont('helvetica', 'bold');
        doc.text(item.name, 25, yPos + 6);
        
        // Description (plus petite)
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Style urbain premium', 25, yPos + 11);
        
        // Quantité, prix, total
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(item.quantity.toString(), 125, yPos + 8);
        doc.text(`${item.price} FCFA`, 140, yPos + 8);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.total} FCFA`, 170, yPos + 8);

        yPos += 15;
      });

      // === TOTAUX SECTION ÉLÉGANTE ===
      yPos += 10;
      
      // Fond pour les totaux
      doc.setFillColor(248, 250, 252);
      doc.rect(110, yPos, 80, 30, 'F');
      
      // Bordure droite colorée
      doc.setFillColor(139, 92, 246); // Violet
      doc.rect(187, yPos, 3, 30, 'F');

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Sous-total
      doc.text('Sous-total:', 115, yPos + 8);
      doc.text(`${orderData.subtotal} FCFA`, 170, yPos + 8);
      
      // Livraison
      doc.text('Livraison:', 115, yPos + 15);
      doc.text('Gratuite', 170, yPos + 15);
      
      // Total final (mis en évidence)
      doc.setFillColor(16, 185, 129); // Vert
      doc.rect(110, yPos + 20, 80, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL FINAL:', 115, yPos + 27);
      doc.text(`${orderData.total} FCFA`, 170, yPos + 27);

      // === MODE DE PAIEMENT ===
      yPos += 45;
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('MODE DE PAIEMENT:', 20, yPos);
      
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(orderData.paymentMethod, 20, yPos + 8);

      // === PIED DE PAGE STYLÉ ===
      const footerY = 260;
      
      // Ligne décorative
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(2);
      doc.line(20, footerY, 190, footerY);
      
      // Message de remerciement
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Merci pour votre confiance !', 20, footerY + 10);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('UrbanTendance - Votre style, notre passion', 20, footerY + 18);
      doc.text('Pour toute question: contact@urbantendance.com', 20, footerY + 25);

      // === ÉLÉMENTS DÉCORATIFS ===
      // Cercles décoratifs dans le coin
      doc.setFillColor(139, 92, 246, 0.1);
      doc.circle(180, 80, 15, 'F');
      doc.setFillColor(59, 130, 246, 0.1);
      doc.circle(185, 85, 10, 'F');

      // === TÉLÉCHARGEMENT ===
      const fileName = `Facture_UrbanTendance_${orderData.invoiceNumber}.pdf`;
      doc.save(fileName);
      
      return {
        success: true,
        fileName: fileName,
        message: 'Facture générée avec succès !'
      };

    } catch (error) {
      console.error('Erreur génération PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = calculateTotal();
      const invoiceNumber = generateInvoiceNumber();
      
      // Données pour la facture
      const orderData = {
        invoiceNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: formatPrice(parseFloat(item.price.replace(/,/g, '')) * item.quantity)
        })),
        subtotal: formatPrice(total),
        total: formatPrice(total),
        paymentMethod: formData.paymentMethod === 'card' ? 'Carte bancaire' :
                      formData.paymentMethod === 'mobile' ? 'Mobile Money' : 'Paiement à la livraison'
      };

      // Générer la belle facture PDF
      await generateBeautifulInvoice(orderData);
      
      // Vider le panier
      localStorage.removeItem('cart');
      
      toast.success('Commande confirmée ! Facture téléchargée !', {
        duration: 4000,
        icon: '🎉'
      });

      // Redirection vers page de succès
      setTimeout(() => {
        router.push('/order-success');
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des produits avant de passer commande</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Finaliser votre commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de livraison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Informations de livraison</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="tel"
                placeholder="Téléphone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Adresse"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Bamenda">Bamenda</option>
              </select>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Mode de paiement</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <span>💳 Carte bancaire</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <span>📱 Mobile Money</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <span>💵 Paiement à la livraison</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </div>
                ) : (
                  `Confirmer la commande - ${formatPrice(calculateTotal())} FCFA`
                )}
              </button>
            </form>
          </div>

          {/* Résumé de commande */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Résumé de votre commande</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
                    {item.name.split(' ')[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(parseFloat(item.price.replace(/,/g, '')) * item.quantity)} FCFA
                    </p>
                    <p className="text-sm text-gray-500">{item.price} FCFA/unité</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(calculateTotal())} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA</span>
                <span>Incluse</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(calculateTotal())} FCFA</span>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">✨ Vos avantages</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Livraison gratuite dès 50,000 FCFA
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Retours gratuits sous 30 jours
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Facture PDF automatique
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Service client 7j/7
                </li>
              </ul>
            </div>

            {/* Sécurité */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span className="mr-2">🔒</span>
                Paiement 100% sécurisé
              </div>
            </div>
          </div>
        </div>

        {/* Message de confiance */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">🚚</span>
              Livraison rapide
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-blue-500 mr-2">💎</span>
              Qualité premium
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-purple-500 mr-2">🎯</span>
              Satisfaction garantie
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}