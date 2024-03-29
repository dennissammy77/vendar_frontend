'use client'
import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import Home from "./(Home)/Hero/page";
import LOGO from "./lib/LOGO";
import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();
  return (
    <Box>
      <Flex justify={'space-between'} align={'center'} py='4' px='20' bg='#ffffff' position={'fixed'} top='0' left='0' w='100%' zIndex='1000'>
          <HStack align='center' mx='2' spacing='4'>
            <LOGO color='#4E2FD7' size='32px'/>
            <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'}>Features</Text>
            <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'}>Pricing</Text>
          </HStack>
          <HStack align='center' spacing='2' fontWeight={'regular'}>
            <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'} onClick={(()=>{router.push('/signin')})}>SignIn</Text>
            <Button as="a" variant="solid" bgColor='#4E2FD7' color='#fff' display="inline-flex" alignItems="center" justifyContent="center" w={{ base: "full", sm: "auto", }} mb={{ base: 2, sm: 0, }} size="lg" cursor="pointer"  onClick={(()=>{router.push('/signup')})}> 
                Get Started
                <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </Icon>
            </Button>
          </HStack>
      </Flex>
      <Home/>
    </Box>
  );
}
