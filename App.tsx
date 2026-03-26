import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/ui/Toast';
import { useSettingsStore } from './src/stores/useSettingsStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

function AppInner() {
  const hydrate = useSettingsStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return (
    <>
      <RootNavigator />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
