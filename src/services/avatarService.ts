// Avatar par défaut en SVG encodé
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z' fill='%239CA3AF'/%3E%3C/svg%3E";

// Cache d'avatars pour éviter les problèmes d'incohérence
const avatarCache: Record<string, string> = {};

// Stocker les avatars des professionnels spécifiques (pour garantir la cohérence)
const PROFESSIONAL_AVATARS: Record<number, string> = {
  1: "https://randomuser.me/api/portraits/men/1.jpg",    // Jean Dupont
  2: "https://randomuser.me/api/portraits/women/2.jpg",  // Marie Martin
  3: "https://randomuser.me/api/portraits/men/3.jpg",    // Pierre Durand
  4: "https://randomuser.me/api/portraits/women/4.jpg",  // Sophie Petit
  5: "https://randomuser.me/api/portraits/men/5.jpg"     // Lucas Bernard
};

/**
 * Vérifie si une URL d'avatar est valide
 * @param avatarUrl URL de l'avatar à vérifier
 * @returns URL validée ou avatar par défaut
 */
export function validateAvatar(avatarUrl?: string): string {
  if (!avatarUrl) return DEFAULT_AVATAR;
  
  // Vérifier si l'URL est déjà dans le cache
  if (avatarCache[avatarUrl]) {
    return avatarCache[avatarUrl];
  }
  
  // Vérifier si l'URL est valide
  try {
    new URL(avatarUrl);
    // Stocker dans le cache
    avatarCache[avatarUrl] = avatarUrl;
    return avatarUrl;
  } catch (e) {
    console.warn('URL d\'avatar invalide:', avatarUrl);
    return DEFAULT_AVATAR;
  }
}

/**
 * Récupère l'avatar d'un professionnel par son ID
 * @param professionalId ID du professionnel
 * @returns URL de l'avatar
 */
export function getProfessionalAvatar(professionalId: number): string {
  const cacheKey = `professional-${professionalId}`;
  
  // Vérifier si déjà en cache
  if (avatarCache[cacheKey]) {
    return avatarCache[cacheKey];
  }
  
  // Rechercher dans les avatars prédéfinis
  if (PROFESSIONAL_AVATARS[professionalId]) {
    avatarCache[cacheKey] = PROFESSIONAL_AVATARS[professionalId];
    return PROFESSIONAL_AVATARS[professionalId];
  }
  
  // Générer un avatar pour ce professionnel basé sur son ID
  const avatarIndex = professionalId % 99; // Pour rester dans les limites de randomuser
  const gender = professionalId % 2 === 0 ? 'women' : 'men';
  const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${avatarIndex}.jpg`;
  
  avatarCache[cacheKey] = avatarUrl;
  return avatarUrl;
}

/**
 * Récupère l'ID du professionnel à partir de son identifiant de conversation
 * @param partnerId Identifiant de conversation (format: 'pro-123')
 * @returns ID du professionnel ou undefined si non valide
 */
export function extractProfessionalId(partnerId: string): number | undefined {
  if (partnerId.startsWith('pro-')) {
    const proIdStr = partnerId.replace('pro-', '');
    const proId = parseInt(proIdStr, 10);
    return isNaN(proId) ? undefined : proId;
  }
  return undefined;
}

/**
 * Formatage de l'ID du professionnel pour les conversations
 * @param professionalId ID du professionnel
 * @returns ID formaté pour les conversations
 */
export function formatProfessionalId(professionalId: number | string): string {
  return `pro-${professionalId}`;
}

/**
 * Gestionnaire d'erreur pour les éléments d'image
 * @param event Événement d'erreur
 */
export function handleAvatarError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  event.currentTarget.src = DEFAULT_AVATAR;
}

const avatarService = {
  validateAvatar,
  getProfessionalAvatar,
  extractProfessionalId,
  formatProfessionalId,
  handleAvatarError,
  DEFAULT_AVATAR
};

export default avatarService; 