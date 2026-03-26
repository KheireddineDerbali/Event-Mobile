import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Event } from '../navigation/types';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      const { data } = await api.get('/events');
      // Sort by latest created by default if needed, assuming backend handles or we can just return
      return data;
    },
  });
};
