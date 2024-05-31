'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from './user.context';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton} from '@clerk/clerk-react';

export function Providers({ children }) {
  const queryClient = new QueryClient()
  return (
	<ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
		<ChakraProvider>
			<QueryClientProvider client={queryClient}>
				<UserProvider>
					{children}
				</UserProvider>
			</QueryClientProvider>
		</ChakraProvider>
	</ClerkProvider>
  );
}
