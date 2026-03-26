import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/services/api';
import { useToastStore } from '@/src/stores/useToastStore';

interface CreateEventPayload {
  title: string;
  description?: string;
  date: string;
  location: string;
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore.getState();

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      // Ensure date is ISO 8601
      const isoDate = new Date(payload.date).toISOString();
      const response = await api.post('/events', { ...payload, date: isoDate });
      return response.data;
    },
    onSuccess: () => {
      showToast('Event created successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message?.toString() || 'Failed to create event', 'error');
    }
  });
};
