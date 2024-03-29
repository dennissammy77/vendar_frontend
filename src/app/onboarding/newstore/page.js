'use client'
import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Text, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { FaWandMagicSparkles } from "react-icons/fa6";
import LOGO from '@/app/lib/LOGO';
import { CreateNewStore } from '@/app/api/shop/route';
import { UserContext } from '@/components/providers/user.context';


function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);
    const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    const schema = yup.object().shape({
      name: yup.string().required(),
      description: yup.string().max(200,'200 maximum character length allowed'),
      mobile: yup.string(),
      email: yup.string().default(user?.email).email().matches(EmailRegex, 'Email address must be of correct format'),
      location: yup.string(),
    });

    const {
      register, 
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: yupResolver(schema),
    });

    const onSubmit = async(data) => {
      try{
        await CreateNewStore(data)
      }catch(err){
        console.log(err)
      }
    }

    return (
      <Box align='center' borderRadius={'md'} boxShadow={'sm'} p='6'> 
          <Flex justify={'center'} align={'center'} w='100%' display={{md:'flex',lg:'none'}}>
            <LOGO color='#4E2FD7'/>
          </Flex>
          <Text fontWeight={'bold'} fontSize={'xl'}>New Store</Text>
          <Text fontSize={'sm'} color='gray.400'>Set up your store to start managing clients, <br/>products easily in one place.</Text>
          {/**New Store Form goes here*/}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt='1' isRequired my='2'>
              <FormLabel>Store Name</FormLabel>
              <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='Johns Shelf' variant='filled'/>
              {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
            </FormControl>
            <FormControl mt='1'>
              <FormLabel>Store email</FormLabel>
              <Input disabled={isSubmitting} {...register('email')} type='email' placeholder='johnstore@store.com' variant='filled'/>
              {errors.email && ( <Text fontSize={'sm'} color='red'>{errors.email.message}</Text>)}
            </FormControl>
            <FormControl mt='1'>
              <FormLabel>Store mobile</FormLabel>
              <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
              {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
            </FormControl>
            <FormControl mt='1' my='2'>
              <FormLabel>Store Location</FormLabel>
              <Input disabled={isSubmitting} {...register('location')} type='text' placeholder='Moi Avenue, Nairobi' variant='filled'/>
              {errors.location && ( <Text fontSize={'sm'} color='red'>{errors.location.message}</Text>)}
            </FormControl>
            <FormControl mt='1' my='2'>
              <FormLabel>About the store</FormLabel>
              <Textarea h='100px' disabled={isSubmitting} {...register('description')} type='text' placeholder='Tell us a bit about your store' variant='filled'/>
              {errors.description && ( <Text fontSize={'sm'} color='red'>{errors.description.message}</Text>)}
            </FormControl>
            {isSubmitting?
              <Button isLoading loadingText='creating your store' variant='ghost' borderRadius={'md'} w='full'/>
              :
              <HStack spacing='' align='center'>
                <Text fontSize={'sm'} color={'gray.400'} textDecoration={'underline 1px solid #e5e5e5'} cursor='pointer' px='2' _hover={{color:'#4E2FD7',fontWeight:'bold'}}>skip for now</Text>
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit} leftIcon={<FaWandMagicSparkles />}>Create your Store</Button>
              </HStack>
            }
          </form>
      </Box>
    )
}

export default Page;