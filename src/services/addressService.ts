// Service pour gérer l'autocomplétion des adresses
// Cette implémentation utilise un set de données statique, mais dans une application réelle
// on pourrait se connecter à une API comme Google Places API ou à la Base Adresse Nationale française

export interface AddressSuggestion {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  fullAddress: string;
}

// Quelques exemples d'adresses françaises pour la démonstration
const ADDRESSES: AddressSuggestion[] = [
  {
    id: '1',
    address: '1 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
    fullAddress: '1 Avenue des Champs-Élysées, 75008 Paris, France'
  },
  {
    id: '2',
    address: '24 Rue de Rivoli',
    city: 'Paris',
    postalCode: '75004',
    country: 'France',
    fullAddress: '24 Rue de Rivoli, 75004 Paris, France'
  },
  {
    id: '3',
    address: '5 Place Bellecour',
    city: 'Lyon',
    postalCode: '69002',
    country: 'France',
    fullAddress: '5 Place Bellecour, 69002 Lyon, France'
  },
  {
    id: '4',
    address: '10 Rue de la Canebière',
    city: 'Marseille',
    postalCode: '13001',
    country: 'France',
    fullAddress: '10 Rue de la Canebière, 13001 Marseille, France'
  },
  {
    id: '5',
    address: '8 Rue du Château',
    city: 'Bordeaux',
    postalCode: '33000',
    country: 'France',
    fullAddress: '8 Rue du Château, 33000 Bordeaux, France'
  },
  {
    id: '6',
    address: '15 Place du Capitole',
    city: 'Toulouse',
    postalCode: '31000',
    country: 'France',
    fullAddress: '15 Place du Capitole, 31000 Toulouse, France'
  },
  {
    id: '7',
    address: '3 Rue Émile Zola',
    city: 'Lille',
    postalCode: '59000',
    country: 'France',
    fullAddress: '3 Rue Émile Zola, 59000 Lille, France'
  },
  {
    id: '8',
    address: '12 Boulevard de la Liberté',
    city: 'Nice',
    postalCode: '06000',
    country: 'France',
    fullAddress: '12 Boulevard de la Liberté, 06000 Nice, France'
  },
  {
    id: '9',
    address: '7 Rue des Lices',
    city: 'Angers',
    postalCode: '49000',
    country: 'France',
    fullAddress: '7 Rue des Lices, 49000 Angers, France'
  },
  {
    id: '10',
    address: '20 Rue Victor Hugo',
    city: 'Strasbourg',
    postalCode: '67000',
    country: 'France',
    fullAddress: '20 Rue Victor Hugo, 67000 Strasbourg, France'
  },
  {
    id: '11',
    address: '5 Rue de la République',
    city: 'Lyon',
    postalCode: '69001',
    country: 'France',
    fullAddress: '5 Rue de la République, 69001 Lyon, France'
  },
  {
    id: '12',
    address: '25 Rue Saint-Antoine',
    city: 'Paris',
    postalCode: '75004',
    country: 'France',
    fullAddress: '25 Rue Saint-Antoine, 75004 Paris, France'
  },
  {
    id: '13',
    address: '18 Avenue Jean Jaurès',
    city: 'Nantes',
    postalCode: '44000',
    country: 'France',
    fullAddress: '18 Avenue Jean Jaurès, 44000 Nantes, France'
  },
  {
    id: '14',
    address: '3 Boulevard Pasteur',
    city: 'Montpellier',
    postalCode: '34000',
    country: 'France',
    fullAddress: '3 Boulevard Pasteur, 34000 Montpellier, France'
  },
  {
    id: '15',
    address: '9 Rue des Capucins',
    city: 'Bordeaux',
    postalCode: '33000',
    country: 'France',
    fullAddress: '9 Rue des Capucins, 33000 Bordeaux, France'
  }
];

export const addressService = {
  /**
   * Recherche des adresses selon un texte de recherche
   * @param query Le texte de recherche pour filtrer les adresses
   * @param limit Limite de résultats (par défaut 5)
   * @returns Liste des suggestions d'adresses
   */
  searchAddresses: (query: string, limit: number = 5): AddressSuggestion[] => {
    if (!query || query.trim().length < 2) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    console.log(`Recherche d'adresses pour: "${normalizedQuery}"`);
    
    // Filtrer les adresses qui correspondent à la requête
    const filteredAddresses = ADDRESSES.filter(address => 
      address.fullAddress.toLowerCase().includes(normalizedQuery) ||
      address.address.toLowerCase().includes(normalizedQuery) ||
      address.city.toLowerCase().includes(normalizedQuery) ||
      address.postalCode.includes(normalizedQuery)
    ).slice(0, limit);
    
    console.log(`${filteredAddresses.length} adresses trouvées pour "${normalizedQuery}"`);
    return filteredAddresses;
  },
  
  /**
   * Dans une application réelle, cette fonction pourrait utiliser la géolocalisation
   * pour obtenir l'adresse actuelle de l'utilisateur
   */
  getCurrentAddress: (): Promise<AddressSuggestion | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler un délai de réseau et retourner une adresse par défaut
        resolve(ADDRESSES[0]);
      }, 500);
    });
  }
}; 