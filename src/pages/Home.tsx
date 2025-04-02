import { Link } from 'react-router-dom';

export default function Home() {
  const services = [
    {
      id: 'garden',
      name: 'Entretien de Jardin',
      description: 'Des professionnels qualifiés pour l\'entretien de votre jardin',
      features: [
        'Tonte de pelouse',
        'Taille de haies',
        'Élagage',
        'Aménagement paysager',
        'Irrigation',
        'Désherbage',
        'Fertilisation',
        'Jardinage écologique'
      ],
      icon: '🌿'
    },
    {
      id: 'pool',
      name: 'Maintenance de Piscine',
      description: 'Une expertise professionnelle pour votre piscine',
      features: [
        'Nettoyage',
        'Traitement de l\'eau',
        'Réparation',
        'Vérification des équipements',
        'Détection de fuites',
        'Optimisation énergétique',
        'Rénovation'
      ],
      icon: '🏊‍♂️'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez le professionnel qu'il vous faut
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des experts qualifiés pour l'entretien de votre jardin et la maintenance de votre piscine
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-5xl mr-4">{service.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/search?service=${service.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Trouver un expert
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 