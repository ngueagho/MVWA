// app/contact/page.tsx - PAGE CONTACT VULNÉRABLE
'use client'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [loading, setLoading] = useState(false)

  // FAILLE: Soumission de formulaire sans validation CSRF
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // FAILLE: Envoi de données non validées
      const response = await fetch('http://62.171.146.0:8000/api/contact/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // FAILLE: Informations sensibles exposées
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ip_address: 'client_ip', // Simulé
          referrer: document.referrer
        })
      })

      if (response.ok) {
        toast.success('Message envoyé avec succès!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          priority: 'normal'
        })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: '📍',
      title: 'Adresse',
      details: ['Quartier Akwa', 'Douala, Cameroun']
    },
    {
      icon: '📞',
      title: 'Téléphone',
      details: ['+237 XXX XXX XXX', '+237 YYY YYY YYY']
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['contact@urbantendance.com', 'support@urbantendance.com']
    },
    {
      icon: '🕒',
      title: 'Horaires',
      details: ['Lun-Ven: 9h-18h', 'Sam: 10h-16h', 'Dim: Fermé']
    }
  ]

  const faqs = [
    {
      question: 'Quels sont vos délais de livraison ?',
      answer: 'Nos délais de livraison sont de 2-5 jours ouvrés pour Douala et Yaoundé, et de 3-7 jours pour les autres villes.'
    },
    {
      question: 'Puis-je retourner un article ?',
      answer: 'Oui, vous disposez de 30 jours pour retourner un article en parfait état avec son emballage d\'origine.'
    },
    {
      question: 'Proposez-vous des tailles sur mesure ?',
      answer: 'Nous proposons un service de retouche pour certains articles. Contactez-nous pour plus d\'informations.'
    },
    {
      question: 'Comment puis-je suivre ma commande ?',
      answer: 'Vous recevrez un numéro de suivi par email dès l\'expédition de votre commande.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contactez-Nous</h1>
          <p className="text-xl">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter !
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Formulaire de Contact */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+237 XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Faible</option>
                    <option value="normal">Normale</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Information produit</option>
                  <option value="livraison">Problème de livraison</option>
                  <option value="retour">Retour/Échange</option>
                  <option value="technique">Problème technique</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              {/* FAILLE: Pas de protection CAPTCHA */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600">
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>
          </div>

          {/* Informations de Contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte (Simulation) */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Localisation</h3>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Carte interactive</p>
                  <p className="text-sm">Quartier Akwa, Douala</p>
                </div>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  📘
                </a>
                <a href="#" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                  📷
                </a>
                <a href="#" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                  🐦
                </a>
                <a href="#" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                  📺
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Questions Fréquentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support d'urgence */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Besoin d'une aide urgente ?</h3>
            <p className="mb-6">
              Pour les urgences et problèmes critiques, contactez directement notre support
            </p>
            <div className="space-x-4">
              <a 
                href="tel:+237XXXXXXX"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                📞 Appeler Maintenant
              </a>
              <a 
                href="https://wa.me/237XXXXXXX"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-block"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}