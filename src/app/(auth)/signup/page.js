import { React } from 'react';
import { Box, Text } from '@chakra-ui/react';
import SignUpForm from '@/components/ui/auth/SignUp-Form';

export default function Page(){
	return(
		<Box w='md' m='auto' align={'center'}>
			<SignUpForm />
		</Box>
	)
}