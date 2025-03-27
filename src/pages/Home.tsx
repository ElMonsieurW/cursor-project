import { Link } from 'react-router-dom';

export default function Home() {
  const services = [
    {
      title: 'Entretien de Jardin',
      description: 'Services professionnels de jardinage, taille de haies, tonte de pelouse, et aménagement paysager',
      icon: '🌿',
      features: [
        'Tonte de pelouse régulière',
        'Taille de haies et arbustes',
        'Désherbage et traitement',
        'Plantation et aménagement'
      ]
    },
    {
      title: 'Maintenance de Piscine',
      description: 'Entretien professionnel et maintenance de piscines pour une eau toujours propre et saine',
      icon: '🏊',
      features: [
        'Analyse et traitement de l\'eau',
        'Nettoyage des filtres',
        'Entretien des équipements',
        'Hivernage et mise en route'
      ]
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            ServicePro
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Experts en entretien de jardins et piscines
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Des professionnels qualifiés pour l'entretien de votre extérieur
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                <div className="flex-1">
                  <span className="text-4xl mb-4 block">{service.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Trouver un professionnel
          </Link>
        </div>
      </div>
    </div>
  );
} 