import { React } from 'react';
import { Box, Text } from '@chakra-ui/react';
import LoginForm from '@/components/ui/auth/Login-Form';

export default function Page(){
	return(
		<Box w='md' m='auto' align={'center'}>
			<LoginForm/>
		</Box>
	)
}