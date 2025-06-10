// app/about/page.tsx - PAGE À PROPOS
'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const team = [
    {
      name: 'Jean-Claude Mvondo',
      role: 'Fondateur & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Passionné de mode urbaine depuis 15 ans'
    },
    {
      name: 'Marie Atangana',
      role: 'Directrice Créative',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      bio: 'Designer formée à Paris et New York'
    },
    {
      name: 'Paul Nkoulou',
      role: 'Responsable Commercial',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Expert en stratégie commerciale'
    }
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Qualité Premium',
      description: 'Nous sélectionnons rigoureusement chaque produit pour garantir une qualité exceptionnelle'
    },
    {
      icon: '🌍',
      title: 'Impact Local',
      description: 'Nous soutenons les talents locaux et contribuons au développement de la mode africaine'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Nous réinventons constamment notre approche pour rester à la pointe des tendances'
    },
    {
      icon: '🤝',
      title: 'Communauté',
      description: 'Nous créons une communauté de passionnés qui partagent nos valeurs et notre vision'
    }
  ]

  const milestones = [
    { year: '2020', event: 'Création d\'UrbanTendance à Douala' },
    { year: '2021', event: 'Lancement de notre première collection' },
    { year: '2022', event: 'Ouverture du magasin physique' },
    { year: '2023', event: 'Expansion vers Yaoundé et Bafoussam' },
    { year: '2024', event: 'Lancement de la plateforme e-commerce' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Notre Histoire</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Depuis 2020, UrbanTendance révolutionne la mode urbaine au Cameroun en proposant 
            des vêtements haut de gamme qui allient style contemporain et authenticité africaine.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Démocratiser la mode urbaine haut de gamme en Afrique centrale en offrant 
                des produits de qualité exceptionnelle à des prix accessibles.
              </p>
              <p className="text-gray-600 mb-6">
                Nous croyons que chaque personne mérite de s'exprimer à travers un style unique 
                et authentique. C'est pourquoi nous curons soigneusement notre collection pour 
                offrir des pièces qui reflètent la diversité et la richesse de la culture urbaine africaine.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-500">Clients satisfaits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500">Produits vendus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-500">Villes desservies</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                alt="Boutique UrbanTendance"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ces valeurs guident chacune de nos décisions et façonnent l'expérience unique 
              que nous offrons à nos clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une équipe passionnée et expérimentée qui travaille chaque jour pour vous offrir 
              le meilleur de la mode urbaine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Parcours</h2>
            <p className="text-lg text-gray-600">
              Découvrez les moments clés qui ont marqué l'évolution d'UrbanTendance
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-600"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez Notre Aventure</h2>
          <p className="text-xl mb-8">
            Nous sommes toujours à la recherche de talents passionnés pour nous rejoindre 
            dans cette aventure extraordinaire.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">📍 Adresse</h3>
              <p>Akwa, Douala<br />Cameroun</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📞 Téléphone</h3>
              <p>+237 XXX XXX XXX</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">✉️ Email</h3>
              <p>contact@urbantendance.com</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Nous Contacter
            </Link>
            <Link 
              href="/careers"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Rejoindre l'Équipe
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ils nous font confiance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 italic mb-4">
                "Excellent service et produits de qualité exceptionnelle. Je recommande vivement !"
              </p>
              <p className="font-semibold text-gray-900">- Sarah M.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 italic mb-4">
                "Livraison rapide et style incomparable. UrbanTendance est devenu ma boutique préférée."
              </p>
              <p className="font-semibold text-gray-900">- David K.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 italic mb-4">
                "Une expérience shopping exceptionnelle du début à la fin. Bravo à toute l'équipe !"
              </p>
              <p className="font-semibold text-gray-900">- Aminata B.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}