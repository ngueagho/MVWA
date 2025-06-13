// frontend/app/checkout/page.tsx - CODE COMPLET
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
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
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    }
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

  // GÉNÉRATEUR DE FACTURE ULTRA MODERNE AVEC GESTION MULTI-PAGES
  const generateUltraModernInvoice = async (orderData) => {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const marginBottom = 40; // Marge de sécurité en bas
      let currentPage = 1;
      // FONCTION POUR CRÉER UNE NOUVELLE PAGE
      const addNewPage = () => {
        doc.addPage();
        currentPage++;
        
        // Header simplifié pour les pages suivantes
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, pageWidth, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('UrbanTendance', 25, 20);
        
        // Numéro de page
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${currentPage}`, 170, 20);
        doc.text(`Facture N° ${orderData.invoiceNumber}`, 170, 26);
        
        return 40; // Position Y de départ pour le contenu
      };

      // FONCTION POUR VÉRIFIER SI ON DOIT CHANGER DE PAGE
      const checkPageBreak = (currentY, requiredSpace) => {
        if (currentY + requiredSpace > pageHeight - marginBottom) {
          return addNewPage();
        }
        return currentY;
      };
            // === HEADER ULTRA MODERNE AVEC DÉGRADÉ ===
      // Fond dégradé principal
      doc.setFillColor(99, 102, 241); // Indigo
      doc.rect(0, 0, pageWidth, 70, 'F');
      
      // Accent dégradé
      doc.setFillColor(139, 92, 246); // Violet
      doc.rect(0, 60, pageWidth, 10, 'F');
      
      // Formes géométriques décoratives
      doc.setFillColor(255, 255, 255, 0.1);
      doc.circle(180, 20, 25, 'F');
      doc.setFillColor(255, 255, 255, 0.05);
      doc.circle(200, 40, 30, 'F');
      
      // Logo stylisé et nom de l'entreprise
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.text('UrbanTendance', 25, 30);
      
      // Sous-titre avec style
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Mode urbaine • Style & Innovation', 25, 40);
      
      // Informations de contact avec icônes
      doc.setFontSize(10);
      doc.text('📍 Douala, Cameroun', 25, 50);
      doc.text('📧 contact@urbantendance.com', 25, 56);
      doc.text('📞 +237 6XX XXX XXX', 25, 62);

      // === SECTION FACTURE (COIN DROIT) ===
      // Boîte pour le numéro de facture
      doc.setFillColor(255, 255, 255, 0.15);
      doc.roundedRect(130, 15, 65, 35, 5, 5, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURE', 135, 25);
      
      doc.setFontSize(20);
      doc.text(`N° ${orderData.invoiceNumber}`, 135, 35);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${orderData.date}`, 135, 43);
      
      // Badge de statut
      doc.setFillColor(34, 197, 94); // Vert success
      doc.roundedRect(135, 46, 20, 6, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYÉE', 137, 50);

      // Numéro de page initial
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`Page ${currentPage}`, 170, 65);

      // === INFORMATIONS CLIENT MODERNES ===
      let yPos = 90;
      
      // Vérifier si on a assez de place pour la section client
      yPos = checkPageBreak(yPos, 45);
      
      // Boîte client avec bordure colorée
      doc.setFillColor(248, 250, 252); // Gris très clair
      doc.roundedRect(25, yPos, 160, 45, 8, 8, 'F');
      
      // Barre colorée à gauche
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(25, yPos, 5, 45, 2, 2, 'F');

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURÉ À', 40, yPos + 12);
      
      // Informations client avec style
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(orderData.customer.name, 40, yPos + 22);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`📧 ${orderData.customer.email}`, 40, yPos + 30);
      doc.text(`📱 ${orderData.customer.phone}`, 40, yPos + 36);
      doc.text(`📍 ${orderData.customer.address}, ${orderData.customer.city}`, 40, yPos + 42);

      // === TABLEAU PRODUITS ULTRA MODERNE AVEC GESTION MULTI-PAGES ===
      yPos += 55;
      
      // Vérifier si on a assez de place pour l'en-tête du tableau
      yPos = checkPageBreak(yPos, 25);
      
      // En-tête du tableau avec dégradé
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(25, yPos, 160, 15, 8, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PRODUIT', 30, yPos + 10);
      doc.text('QTÉ', 110, yPos + 10);
      doc.text('PRIX UNIT.', 130, yPos + 10);
      doc.text('TOTAL', 165, yPos + 10);

      yPos += 15;

      // Lignes de produits avec gestion automatique des pages
      orderData.items.forEach((item, index) => {
        const rowHeight = 20;
        
        // Vérifier si on a assez de place pour cette ligne + marge
        if (yPos + rowHeight > pageHeight - marginBottom) {
          yPos = addNewPage();
          
          // Répéter l'en-tête du tableau sur la nouvelle page
          doc.setFillColor(99, 102, 241);
          doc.roundedRect(25, yPos, 160, 15, 8, 8, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('PRODUIT (suite)', 30, yPos + 10);
          doc.text('QTÉ', 110, yPos + 10);
          doc.text('PRIX UNIT.', 130, yPos + 10);
          doc.text('TOTAL', 165, yPos + 10);
          
          yPos += 15;
        }
        
        // Fond alterné avec coins arrondis
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.roundedRect(25, yPos, 160, rowHeight, 4, 4, 'F');
        }

        // Nom du produit avec style
        doc.setTextColor(31, 41, 55);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(item.name, 30, yPos + 8);
        
        // Description produit
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Style urbain premium', 30, yPos + 14);
        
        // Quantité avec badge
        doc.setFillColor(219, 234, 254); // Bleu clair
        doc.roundedRect(108, yPos + 4, 12, 8, 2, 2, 'F');
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.quantity.toString(), 113, yPos + 9);
        
        // Prix unitaire
        doc.setTextColor(75, 85, 99);
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.price}`, 132, yPos + 9);
        
        // Total en gras
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text(`${item.total}`, 167, yPos + 9);

        yPos += rowHeight;
      });

      // === SECTION TOTAUX ÉLÉGANTE ===
      yPos += 15;
      
      // Vérifier si on a assez de place pour les totaux
      yPos = checkPageBreak(yPos, 50);
      
      // Boîte totaux avec style
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(100, yPos, 85, 40, 8, 8, 'F');
      
      // Accent coloré
      doc.setFillColor(139, 92, 246);
      doc.roundedRect(180, yPos, 5, 40, 2, 2, 'F');

      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Sous-total
      doc.text('Sous-total:', 105, yPos + 10);
      doc.text(`${orderData.subtotal} FCFA`, 150, yPos + 10);
      
      // Livraison
      doc.text('Livraison:', 105, yPos + 18);
      doc.setTextColor(34, 197, 94);
      doc.setFont('helvetica', 'bold');
      doc.text('GRATUITE', 150, yPos + 18);
      
      // TVA
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text('TVA (19.25%):', 105, yPos + 26);
      doc.text('Incluse', 150, yPos + 26);
      
      // Total final avec highlight
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(100, yPos + 30, 85, 12, 6, 6, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL FINAL:', 105, yPos + 38);
      doc.text(`${orderData.total} FCFA`, 150, yPos + 38);

      // === INFORMATIONS PAIEMENT ===
      yPos += 60;
      
      // Vérifier si on a assez de place pour les infos paiement
      yPos = checkPageBreak(yPos, 30);
      
      // Boîte paiement
      doc.setFillColor(254, 243, 199); // Jaune clair
      doc.roundedRect(25, yPos, 160, 20, 6, 6, 'F');
      
      doc.setTextColor(146, 64, 14); // Orange foncé
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('💳 MODE DE PAIEMENT:', 30, yPos + 8);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(orderData.paymentMethod, 30, yPos + 15);

      // === SECTION REMERCIEMENTS STYLÉE ===
      yPos += 35;
      
      // Vérifier si on a assez de place pour les remerciements
      yPos = checkPageBreak(yPos, 25);
      
      // Message principal
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('🎉 Merci pour votre confiance !', 25, yPos);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Votre commande a été traitée avec succès. Vous recevrez un suivi par email.', 25, yPos + 10);

      // === PIED DE PAGE MODERNE (dernière page seulement) ===
      const addFooter = (pageNum) => {
        const footerY = pageHeight - 35;
        
        // Ligne de séparation stylée
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(1);
        doc.line(25, footerY, 185, footerY);
        
        // Informations de contact et social
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('UrbanTendance - Excellence • Innovation • Style', 25, footerY + 8);
        doc.text('🌐 www.urbantendance.com  |  📱 @urbantendance_official', 25, footerY + 15);
        doc.text('Support client: support@urbantendance.com  |  📞 +237 6XX XXX XXX', 25, footerY + 22);
        
        // Conditions en petit
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text('Conditions générales disponibles sur notre site web. Garantie de satisfaction 30 jours.', 25, footerY + 30);

        // Numéro de page en bas à droite
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.text(`Page ${pageNum}/${currentPage}`, 175, footerY + 30);
      };

      // Ajouter le pied de page à toutes les pages
      for (let i = 1; i <= currentPage; i++) {
        if (i > 1) {
          doc.setPage(i);
        }
        addFooter(i);
      }

      // Retourner à la dernière page pour les éléments décoratifs
      doc.setPage(currentPage);

      // === ÉLÉMENTS DÉCORATIFS FINAUX (dernière page seulement) ===
      // Cercles décoratifs
      doc.setFillColor(139, 92, 246, 0.1);
      doc.circle(15, 150, 8, 'F');
      doc.setFillColor(99, 102, 241, 0.1);
      doc.circle(195, 200, 12, 'F');
      
      // QR Code simulé (carré décoratif)
      const qrY = pageHeight - 60;
      doc.setFillColor(31, 41, 55);
      doc.rect(160, qrY, 20, 20, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text('QR', 168, qrY + 12);
      doc.setFillColor(99, 102, 241, 0.1);
      doc.circle(195, 200, 12, 'F');
      
      // QR Code simulé (carré décoratif)
      doc.setFillColor(31, 41, 55);
      doc.rect(160, footerY + 5, 20, 20, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text('QR', 168, footerY + 16);

      // === TÉLÉCHARGEMENT AVEC NOM PERSONNALISÉ ===
      const fileName = `Facture_UrbanTendance_${orderData.invoiceNumber}_${orderData.customer.name.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
      
      return {
        success: true,
        fileName: fileName,
        totalPages: currentPage,
        message: `Facture premium générée avec succès ! (${currentPage} page${currentPage > 1 ? 's' : ''})`
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
        paymentMethod: formData.paymentMethod === 'card' ? 'Carte bancaire (Visa/Mastercard)' :
                      formData.paymentMethod === 'mobile' ? 'Mobile Money (MTN/Orange)' : 'Paiement à la livraison (Cash)'
      };

      // Générer la facture ultra moderne
      const result = await generateUltraModernInvoice(orderData);
      
      if (result.success) {
        // Vider le panier
        localStorage.removeItem('cart');
        
        toast.success(`🎉 Commande confirmée ! Facture téléchargée ! (${result.totalPages} page${result.totalPages > 1 ? 's' : ''})`, {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
          }
        });

        // Redirection vers page de succès
        setTimeout(() => {
          router.push('/order-success');
        }, 2000);
      } else {
        toast.error('Erreur lors de la génération de la facture');
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Il semble que votre panier soit vide. Découvrez nos collections et ajoutez des produits avant de passer commande.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Finaliser votre commande</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complétez vos informations pour recevoir vos produits UrbanTendance
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de livraison */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Informations de livraison</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom *</label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom *</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Téléphone *</label>
                <input
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Adresse complète *</label>
                <input
                  type="text"
                  placeholder="Rue, quartier, détails..."
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ville</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="Douala">🏙️ Douala</option>
                  <option value="Yaoundé">🏛️ Yaoundé</option>
                  <option value="Bafoussam">🌄 Bafoussam</option>
                  <option value="Bamenda">🌿 Bamenda</option>
                </select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">💳</span>
                  Mode de paiement
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-4 w-5 h-5 text-blue-600"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💳</span>
                      <div>
                        <div className="font-semibold">Carte bancaire</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard - Sécurisé</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-4 w-5 h-5 text-green-600"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      <div>
                        <div className="font-semibold">Mobile Money</div>
                        <div className="text-sm text-gray-500">MTN Money, Orange Money</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-yellow-50 hover:border-yellow-300 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-4 w-5 h-5 text-yellow-600"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💵</span>
                      <div>
                        <div className="font-semibold">Paiement à la livraison</div>
                        <div className="text-sm text-gray-500">Cash ou Mobile Money</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Confirmer la commande - {formatPrice(calculateTotal())} FCFA
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Résumé de commande */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">📦</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Résumé de votre commande</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-700">
                    {item.name.split(' ')[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      {formatPrice(parseFloat(item.price.replace(/,/g, '')) * item.quantity)} FCFA
                    </p>
                    <p className="text-sm text-gray-500">{item.price} FCFA/unité</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center">
                  <span className="mr-2">📊</span>
                  Sous-total
                </span>
                <span className="font-semibold">{formatPrice(calculateTotal())} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center">
                  <span className="mr-2">🚚</span>
                  Livraison
                </span>
                <span className="text-green-600 font-bold">GRATUITE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center">
                  <span className="mr-2">🧾</span>
                  TVA (19.25%)
                </span>
                <span className="font-medium">Incluse</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">💰</span>
                    Total final
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(calculateTotal())} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">✨</span>
                Vos avantages UrbanTendance
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span><strong>Livraison gratuite</strong> dès 50,000 FCFA</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span><strong>Retours gratuits</strong> sous 30 jours</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span><strong>Facture PDF premium</strong> générée automatiquement</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span><strong>Support client</strong> 7j/7 par WhatsApp</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span><strong>Garantie satisfaction</strong> 100% remboursé</span>
                </li>
              </ul>
            </div>

            {/* Badges de confiance */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm font-semibold text-green-800">Paiement 100% sécurisé</div>
                <div className="text-xs text-green-600">SSL & Cryptage</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-blue-800">Livraison rapide</div>
                <div className="text-xs text-blue-600">24-48h à Douala</div>
              </div>
            </div>

            {/* Programme fidélité */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">🎯</span>
                    <span className="font-semibold text-gray-900">Points fidélité</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Gagnez {Math.floor(calculateTotal() / 1000)} points avec cette commande
                  </div>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section confiance et réassurance */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Pourquoi choisir UrbanTendance ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Livraison Express</h4>
              <p className="text-gray-600 text-sm">
                Livraison rapide et sécurisée dans tout le Cameroun. Suivi en temps réel de votre commande.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💎</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Qualité Premium</h4>
              <p className="text-gray-600 text-sm">
                Matériaux de haute qualité, designs exclusifs et finitions soignées pour un style unique.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Satisfaction Garantie</h4>
              <p className="text-gray-600 text-sm">
                30 jours pour changer d'avis. Service client réactif et bienveillant à votre écoute.
              </p>
            </div>
          </div>
        </div>

        {/* Message de confiance final */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-6 shadow-lg border border-gray-100">
            <div className="flex items-center text-sm text-gray-700">
              <span className="text-green-500 mr-2 text-lg">🌟</span>
              <span><strong>4.9/5</strong> - 1,250+ avis clients</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="text-blue-500 mr-2 text-lg">📱</span>
              <span><strong>24/7</strong> Support WhatsApp</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="text-purple-500 mr-2 text-lg">🔥</span>
              <span><strong>10k+</strong> Clients satisfaits</span>
            </div>
          </div>
        </div>

        {/* Note de sécurité */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            🔐 Vos données personnelles sont protégées et chiffrées. Nous ne partageons jamais vos informations avec des tiers. 
            Paiement sécurisé par SSL 256-bit. Conformité RGPD garantie.
          </p>
        </div>
      </div>
    </div>
  );
}