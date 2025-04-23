// lib/hooks/useOllamaModels.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useOllamaModels = () => {
  return useQuery({
    queryKey: ['getModels'],
    queryFn: () =>
      axios.get('/api/ollama/getModels', {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.data),
      staleTime: Infinity,
  });
};
