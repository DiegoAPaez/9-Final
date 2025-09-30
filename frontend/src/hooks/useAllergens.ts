import { useState, useEffect } from 'react';
import api from '../services/api/base';
import { formatAllergenName } from '../utils/menuValidation';

export interface AllergenOption {
  id: number;
  name: string;
}

export function useAllergens() {
  const [allergens, setAllergens] = useState<AllergenOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllergens = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/allergens');
        console.log('Allergens API response:', response.data); // Debug log
        const mapped = Array.isArray(response.data)
          ? response.data.map((item, idx) => ({
              id: idx + 1,
              name: formatAllergenName(item.value)
            }))
          : [];
        setAllergens(mapped);
      } catch {
        setError('Failed to load allergens.');
      } finally {
        setLoading(false);
      }
    };
    void fetchAllergens(); // Fix warning
  }, []);

  return { allergens, loading, error };
}
