'use client'
import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Text, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import LOGO from '@/app/lib/LOGO';
import { UserContext } from '@/components/providers/user.context';
import NewStoreForm from '@/components/ui/store/NewStoreForm';

function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;

    useEffect(()=>{
      router.prefetch(`/dashboard/home?uid=${USER_ID}`);
    },[]);

    return (
      <Box align='center' borderRadius={'md'} boxShadow={'sm'} px='6' py='2' w='full'> 
          <Flex justify={'center'} align={'center'} w='100%' hideFrom='md'>
            <LOGO color='#4E2FD7' size='32px'/>
          </Flex>
          <Text fontWeight={'bold'} fontSize={'xl'}>New Store</Text>
          <Text fontSize={'sm'} color='gray.400'>Set up your store to start managing clients, <br/>products easily in one place.</Text>
          {/**New Store Form goes here*/}
          <NewStoreForm />
          <Text 
            fontSize={'sm'}
            color={'gray.400'}
            textDecoration={'underline 1px solid #e5e5e5'}
            cursor='pointer'
            px='2'
            _hover={{color:'#4E2FD7',fontWeight:'bold'}}
            my='2'
            onClick={(()=>{
              if(typeof(window) === 'undefined'){
                router.push(`/dashboard/home?uid=${USER_ID}`)
              }
              window.location.href = `/dashboard/home?uid=${USER_ID}`
            })}>
              skip for now</Text>
      </Box>
    )
}

export default Page;