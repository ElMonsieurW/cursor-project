import { useState, useEffect, useRef } from 'react';
import { addressService, AddressSuggestion } from '../services/addressService';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  id = 'address',
  name = 'address',
  label = 'Adresse',
  placeholder = 'Saisissez votre adresse...',
  required = false,
  className = '',
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Chercher des suggestions quand la valeur change
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsLoading(true);
      const results = addressService.searchAddresses(value);
      setSuggestions(results);
      setIsLoading(false);
      console.log('Suggestions trouvées:', results.length);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  // Gérer la navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    // Flèche bas - sélectionner la suggestion suivante
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    // Flèche haut - sélectionner la suggestion précédente
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
    // Entrée - sélectionner la suggestion actuelle
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    }
    // Echap - fermer les suggestions
    else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.fullAddress);
    setSuggestions([]);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  // Utiliser l'emplacement actuel
  const handleUseCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const currentAddress = await addressService.getCurrentAddress();
      if (currentAddress) {
        onChange(currentAddress.fullAddress);
        if (onSelect) {
          onSelect(currentAddress);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse actuelle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Petit délai pour permettre le clic sur une suggestion
            setTimeout(() => {
              if (suggestionsRef.current && !suggestionsRef.current.contains(document.activeElement)) {
                setIsFocused(false);
              }
            }, 150);
          }}
          placeholder={placeholder}
          required={required}
          className={`block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
          autoComplete="off"
        />
        {isLoading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-10">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : null}
        
        {/* Bouton pour utiliser l'emplacement actuel */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 hover:text-indigo-500"
          title="Utiliser l'adresse actuelle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === selectedIndex ? 'bg-indigo-600 text-white' : 'text-gray-900'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{suggestion.address}</span>
                <span className={`text-sm ${index === selectedIndex ? 'text-indigo-100' : 'text-gray-500'}`}>
                  {suggestion.postalCode} {suggestion.city}, {suggestion.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete; 