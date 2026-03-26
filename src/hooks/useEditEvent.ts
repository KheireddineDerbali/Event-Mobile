import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/services/api';
import { useToastStore } from '@/src/stores/useToastStore';

interface EditEventPayload {
  id: string;
  data: {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
  }
}

export const useEditEvent = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore.getState();

  return useMutation({
    mutationFn: async ({ id, data }: EditEventPayload) => {
      const payload = { ...data };
      if (payload.date) {
        payload.date = new Date(payload.date).toISOString();
      }
      const response = await api.patch(`/events/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      showToast('Event updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message?.toString() || 'Failed to update event', 'error');
    }
  });
};
