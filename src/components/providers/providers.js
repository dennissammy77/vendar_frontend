'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from './user.context';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export function Providers({ children }) {
  const queryClient = new QueryClient()
  return (
    <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            {children}
          </UserProvider>
        </QueryClientProvider>
    </ChakraProvider>
  );
}