import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import MessageForm from '../components/MessageForm';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';

interface Professional {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  profession: string;
  description: string;
  phone: string;
  address: string;
}

interface TimeSlot {
  id: string;
  professional_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function ProfessionalProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchProfessional(id);
      fetchTimeSlots(id);
    }
  }, [id]);

  const fetchProfessional = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', professionalId)
        .single();

      if (error) throw error;
      setProfessional(data);
    } catch (err) {
      console.error('Erreur lors de la récupération du professionnel:', err);
      setError('Une erreur est survenue lors de la récupération du profil');
    }
  };

  const fetchTimeSlots = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('is_available', true)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des créneaux:', err);
      setError('Une erreur est survenue lors de la récupération des créneaux');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (timeSlotId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Créer la réservation
      await bookingService.createBooking(user.id, professional?.id || '', timeSlotId);

      // Mettre à jour la disponibilité du créneau
      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('id', timeSlotId);

      if (slotError) throw slotError;

      setSuccess('Réservation effectuée avec succès !');
      
      // Rafraîchir la liste des créneaux
      await fetchTimeSlots(professional?.id || '');

      // Rediriger vers la page des réservations après un court délai
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      setError('Une erreur est survenue lors de la réservation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || 'Professionnel non trouvé'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full"
                src={professional.avatar_url || 'https://via.placeholder.com/150'}
                alt={professional.name}
              />
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{professional.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{professional.profession}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{professional.email}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{professional.phone}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{professional.address}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{professional.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Créneaux disponibles</h3>
          {timeSlots.length === 0 ? (
            <p className="text-gray-500">Aucun créneau disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="bg-white shadow rounded-lg p-4">
                  <p className="text-sm text-gray-900">
                    {new Date(slot.start_time).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <button
                    onClick={() => handleBooking(slot.id)}
                    className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Réserver
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <MessageForm 
            professionalId={professional.id} 
            professionalName={professional.name} 
          />
        </div>
      </div>
    </div>
  );
} 