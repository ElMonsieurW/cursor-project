export interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  avatar: string;
  price: string;
}

// Base de professionnels
const professionals: Professional[] = [
  {
    id: 1,
    name: "Jean Dupont",
    service: "Plomberie",
    rating: 4.8,
    reviews: 125,
    location: "Paris, 75001",
    specialties: ["Réparation de fuites", "Installation sanitaire", "Chauffage"],
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    price: "60€/h"
  },
  {
    id: 2,
    name: "Marie Martin",
    service: "Électricité",
    rating: 4.7,
    reviews: 98,
    location: "Lyon, 69002",
    specialties: ["Installation électrique", "Dépannage", "Domotique"],
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    price: "55€/h"
  },
  {
    id: 3,
    name: "Pierre Durand",
    service: "Jardinage",
    rating: 4.5,
    reviews: 87,
    location: "Marseille, 13001",
    specialties: ["Taille de haies", "Entretien de pelouse", "Aménagement paysager"],
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    price: "45€/h"
  },
  {
    id: 4,
    name: "Sophie Petit",
    service: "Ménage",
    rating: 4.9,
    reviews: 156,
    location: "Bordeaux, 33000",
    specialties: ["Nettoyage régulier", "Grand ménage", "Nettoyage de vitres"],
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    price: "30€/h"
  },
  {
    id: 5,
    name: "Lucas Bernard",
    service: "Bricolage",
    rating: 4.6,
    reviews: 112,
    location: "Lille, 59000",
    specialties: ["Montage de meubles", "Fixations murales", "Petites réparations"],
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    price: "40€/h"
  }
];

export const professionalService = {
  // Récupérer tous les professionnels
  getAllProfessionals: (): Professional[] => {
    return professionals;
  },
  
  // Récupérer un professionnel par ID
  getProfessionalById: (id: number): Professional | undefined => {
    return professionals.find(pro => pro.id === id);
  },
  
  // Filtrer les professionnels en fonction des critères
  getFilteredProfessionals: (
    service?: string,
    searchQuery?: string,
    location?: string
  ): Professional[] => {
    let filtered = [...professionals];
    
    // Filtrer par service
    if (service && service !== 'all') {
      filtered = filtered.filter(pro => pro.service.toLowerCase() === service.toLowerCase());
    }
    
    // Filtrer par recherche (nom ou spécialité)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pro => 
        pro.name.toLowerCase().includes(query) || 
        pro.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
    }
    
    // Filtrer par localisation
    if (location) {
      filtered = filtered.filter(pro => 
        pro.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return filtered;
  }
}; 