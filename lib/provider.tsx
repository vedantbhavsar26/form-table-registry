'use client';
import React, { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const getKnownError = (error: Error) => {
  if (error.message.includes('product_batch_quantity_remaining_check')) {
    return 'Not enough product in stock';
  }
  if (error.message.includes('unique_session_item')) {
    return 'This item is already in the cart for this session. Please edit the item from the cart.';
  }
  return error.message;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
      onError: (error) => {
        const message = getKnownError(error);
        toast.error(message);
      },
    },
  },
});
export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors={true} />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  );
};
