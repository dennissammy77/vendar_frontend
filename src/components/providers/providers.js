'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from './user.context';

export function Providers({ children }) {
  return (
    <ChakraProvider>
        <UserProvider>
          {children}
        </UserProvider>
    </ChakraProvider>
  );
}