'use client'
import { Avatar, Box, Button, Flex, HStack, Icon, Text, useToast } from "@chakra-ui/react";
import Home from "./(Home)/Hero/page";
import LOGO from "./lib/LOGO";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/providers/user.context";
import { useContext, useEffect } from "react";
import useLogOut from "@/components/hooks/useLogOut.hook";
import Link from "next/link";
import Features from "./(Home)/Features/page";
import useFetchToken from "@/components/hooks/useFetchToken.hook";

export default function Index() {
  const router = useRouter();
  const toast = useToast()
  const {user} = useContext(UserContext);
  const token = useFetchToken();
  useEffect(()=>{
    router.prefetch('/signin')
    router.prefetch('/signup')
  },[])
  const HandleLogout =()=>{
    useLogOut();
    if(typeof(window) === 'undefined'){
      router.replace('/');
    }else{
      window.location.href ='/'
    }
  }

  return (
    <Box>
      <Flex justify={'space-between'} align={'center'} py='4' px={{sm:5,md:'20'}} bg='#ffffff' position={'fixed'} top='0' left='0' w='100%' zIndex='1000'>
          <HStack align='center' mx='4' spacing='4'>
            <LOGO color='#4E2FD7' size='32px'/>
            {/**
             * 
            <HStack hideBelow={'sm'} display={'none'}>
              <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'} >Features</Text>
              <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'} >Pricing</Text>
            </HStack>
             */}
          </HStack>
          {!token?
            <HStack align='center' spacing='2' fontWeight={'regular'}>
              <Link href={`/signin`} >
                <Text cursor={'pointer'} _hover={{fontWeight:'bold'}} transition={'.3s ease-in-out'}>SignIn</Text>
              </Link>
              <Button as="a" size={'sm'} variant="solid" bgColor='#4E2FD7' color='#fff' display="inline-flex" alignItems="center" justifyContent="center" w={{ base: "full", sm: "auto", }} mr='1' cursor="pointer"  onClick={(()=>{router.push('/signup')})}> 
                  Get Started
                  <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor" hideBelow={'sm'}>
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </Icon>
              </Button>
            </HStack>
            :
            <Flex align='center' mr='2' gap='2'>
              <Link onClick={(()=>{HandleLogout()})} href='/' cursor={'pointer'} color='#4E2FD7' fontWeight={'bold'}>LogOut</Link>
              <Link href={`/dashboard/home?uid=${user?.data?.data?._id}&store_id=${user?.data?.data?.store_ref[0]?._id}`}>
                <HStack align='center' spacing='2' fontWeight={'regular'} bgColor='#E4F0FC' py='1' px='2' borderRadius={'full'} cursor='pointer'>
                  <Text fontSize={'sm'} fontWeight={'bold'} >
                    Profile
                  </Text>
                  <Avatar name={user?.data?.data?.name || user?.data?.data?.username} src={user?.data?.data?.profile_image_url || ''} size={'sm'}/>
                </HStack>
              </Link>
            </Flex>
          }
      </Flex>
      <Home/>
      <Features/>
    </Box>
  );
}