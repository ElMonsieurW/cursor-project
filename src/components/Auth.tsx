import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '../lib/auth/authService';

export default function Auth() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError('Veuillez vérifier votre email pour confirmer votre inscription');
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('Une erreur est survenue lors de l\'authentification');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('Une erreur est survenue lors de la déconnexion');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Bienvenue !</h2>
        <p className="mb-4">Vous êtes connecté en tant que : {user.email}</p>
        <p className="mb-4 text-sm text-gray-600">
          Rôle : {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </p>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? 'Créer un compte' : 'Se connecter'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Chargement...' : (isSignUp ? 'S\'inscrire' : 'Se connecter')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-indigo-600 hover:text-indigo-800"
          disabled={loading}
        >
          {isSignUp
            ? 'Déjà un compte ? Se connecter'
            : 'Pas de compte ? S\'inscrire'}
        </button>
      </div>
    </div>
  );
} 