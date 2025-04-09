import { supabase } from '../supabaseClient';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async signIn(email: string, password: string): Promise<void> {
    try {
      console.log('Tentative de connexion dans authService');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Réponse de signIn:', { data, error });

      if (error) {
        console.error('Erreur de connexion Supabase:', error);
        throw new AuthError(error.message);
      }

      if (!data.session) {
        throw new AuthError('Aucune session créée');
      }
    } catch (error) {
      console.error('Erreur dans signIn:', error);
      if (error instanceof AuthError) throw error;
      throw new AuthError('Une erreur est survenue lors de la connexion');
    }
  },

  async signUp(email: string, password: string, userData?: { first_name?: string; last_name?: string }): Promise<void> {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw new AuthError(error.message);
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('Une erreur est survenue lors de l\'inscription');
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AuthError('Erreur lors de la déconnexion');
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new AuthError('Erreur lors de la récupération de l\'utilisateur');
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new AuthError('Erreur lors de la récupération de la session');
    return session;
  }
}; 