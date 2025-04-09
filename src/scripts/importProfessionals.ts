import { supabase } from '../lib/supabaseClient';

interface Professional {
  name: string;
  email: string;
  profession: string;
  avatar_url: string;
  description?: string;
  rating?: number;
  price_per_hour?: number;
  location?: string;
  phone?: string;
}

const professionals: Professional[] = [
  {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    profession: "Jardinier",
    avatar_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    description: "Jardinier expérimenté spécialisé dans l'entretien des espaces verts",
    rating: 4.8,
    price_per_hour: 45,
    location: "Paris",
    phone: "0612345678"
  },
  {
    name: "Marie Martin",
    email: "marie.martin@example.com",
    profession: "Plombier",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    description: "Plombier qualifié pour tous types d'interventions",
    rating: 4.9,
    price_per_hour: 60,
    location: "Lyon",
    phone: "0623456789"
  },
  {
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    profession: "Électricien",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    description: "Électricien certifié pour installations et dépannages",
    rating: 4.7,
    price_per_hour: 55,
    location: "Marseille",
    phone: "0634567890"
  },
  {
    name: "Sophie Lambert",
    email: "sophie.lambert@example.com",
    profession: "Peintre",
    avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    description: "Peintre en bâtiment pour intérieur et extérieur",
    rating: 4.6,
    price_per_hour: 40,
    location: "Bordeaux",
    phone: "0645678901"
  },
  {
    name: "Thomas Moreau",
    email: "thomas.moreau@example.com",
    profession: "Menuisier",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    description: "Menuisier spécialisé dans la rénovation et la création",
    rating: 4.8,
    price_per_hour: 50,
    location: "Toulouse",
    phone: "0656789012"
  }
];

async function importProfessionals() {
  console.log('Début de l\'importation des professionnels...');

  for (const professional of professionals) {
    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: professional.email,
        password: 'password123', // À changer après la création
        email_confirm: true
      });

      if (authError) {
        console.error(`Erreur lors de la création de l'utilisateur ${professional.email}:`, authError);
        continue;
      }

      if (!authData.user) {
        console.error(`Aucun utilisateur créé pour ${professional.email}`);
        continue;
      }

      // 2. Créer le profil dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: professional.name,
            email: professional.email,
            profession: professional.profession,
            avatar_url: professional.avatar_url,
            description: professional.description,
            rating: professional.rating,
            price_per_hour: professional.price_per_hour,
            location: professional.location,
            phone: professional.phone
          }
        ]);

      if (profileError) {
        console.error(`Erreur lors de la création du profil pour ${professional.email}:`, profileError);
        continue;
      }

      console.log(`Professionnel ${professional.name} importé avec succès`);
    } catch (error) {
      console.error(`Erreur lors de l'importation de ${professional.name}:`, error);
    }
  }

  console.log('Importation terminée');
}

// Exécuter l'importation
importProfessionals().catch(console.error); 