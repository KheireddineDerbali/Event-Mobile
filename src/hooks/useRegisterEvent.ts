import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/services/api';
import { useToastStore } from '@/src/stores/useToastStore';

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore.getState();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post(`/events/${eventId}/register`);
      return response.data;
    },
    onSuccess: () => {
      showToast('Successfully registered for the event!', 'success');
      // Invalidate events to reflect any changes if needed, per requirements
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        showToast('You are already registered for this event.', 'error');
      } else if (error.response?.status === 404) {
        showToast('Event not found.', 'error');
      } else {
        showToast(error.response?.data?.message?.toString() || 'Failed to register', 'error');
      }
    }
  });
};
