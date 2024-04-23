'use client'
import { Box, Button, FormControl, FormLabel, Grid, GridItem, HStack, Icon, Text, Textarea, useToast } from '@chakra-ui/react'
import Link from 'next/link';
import React, { useContext } from 'react'
import { FaBook, FaPhoneAlt } from 'react-icons/fa';
import { GoCommentDiscussion } from "react-icons/go";
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdEmail, MdOutlinePrivacyTip } from 'react-icons/md';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { UserContext } from '@/components/providers/user.context';
import { NEW_SUPPORT_TICKET } from '@/app/api/support/route';
import { useRouter } from 'next/navigation';

function Page() {
  const {user} = useContext(UserContext);
  
  const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


  const schema = yup.object().shape({
    name: yup.string().required(),
    mobile: yup.string().required(),
    email: yup.string().email().matches(EmailRegex, 'Email address must be of correct format').required(),
    message: yup.string().max(300,'300 maximum character length allowed').required()
  });

  const {
      register, 
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
  } = useForm({
      resolver: yupResolver(schema),
      defaultValues:{
        name: user?.data?.data?.name,
        mobile: user?.data?.data?.mobile,
        email: user?.data?.data?.email
      }
  });

  const toast = useToast();
  const router = useRouter()

  const onSubmit = async(data) => {
    try {
      await NEW_SUPPORT_TICKET(data).then((response)=>{
        if(response?.data?.error === true){
            return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
        }
        toast({ title: 'Success!:Ticket created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
        setTimeout(()=>{
            router.refresh()
        },2000)
        return ;
      }).catch((err)=>{
          return toast({ title: `${err}`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
      })
    } catch (error){
      setError("root", {
        message: error,
      });
      return;
    }
  }
  return (
    <Box>
      <Text fontWeight='bold' fontSize='32px'>Support Center</Text>
      <Grid
        templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
        templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
        gap={4}
        my='6'
      >
        <GridItem 
          rowSpan={1}
          colSpan={1}
          bg='#FFF'
          p='4'
          boxShadow={'sm'}
          borderRadius={'md'}
        >
          <Text fontSize='24px'>Leave us a message</Text>
          <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt='1' my='2' isRequired>
                  <Textarea disabled={isSubmitting} {...register('message')} type='text' h='200px' placeholder='I need help with ...' my='4' variant='filled'/>
                  {errors.message && ( <Text fontSize={'sm'} color='red'>{errors.message.message}</Text>)}
              </FormControl>
              {isSubmitting?
                  <Button isLoading loadingText='submitting your ticket' variant='ghost' borderRadius={'md'} w='full'/>
                  :
                  <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Submit</Button>
              }
          </form>
        </GridItem>
        <GridItem 
          colSpan={1}
        >
          <HStack p='4' align='center' boxShadow={'sm'} borderRadius={'md'} my='2' spacing='4' opacity={.2}>
            <Icon as={FaBook} boxSize='6' color='gray.400'/>
            <Box>
              <Text fontWeight={'bold'} fontSize={'lg'}>User Guides</Text>
              <Text>Find your way through key features in the application</Text>
            </Box>
          </HStack>
          <HStack p='4' align='center' boxShadow={'sm'} borderRadius={'md'} my='2' spacing='4' cursor='pointer' onClick={(()=>{router.push(`/dashboard/support/terms?uid=${user?.data?.data?._id}`)})}>
            <Icon as={IoDocumentTextOutline} boxSize='6' color='gray.400'/>
            <Box>
              <Text fontWeight={'bold'} fontSize={'lg'}>Terms&Conditions</Text>
              <Text>Read through our terms of service, disclaimers and guidelines.</Text>
            </Box>
          </HStack>
          <HStack p='4' align='center' boxShadow={'sm'} borderRadius={'md'} my='2' spacing='4' cursor='pointer' onClick={(()=>{router.push(`/dashboard/support/disclaimer?uid=${user?.data?.data?._id}`)})}>
            <Icon as={GoCommentDiscussion} boxSize='6' color='gray.400'/>
            <Box>
              <Text fontWeight={'bold'} fontSize={'lg'}>Disclaimer</Text>
              <Text>Read about our disclaimers</Text>
            </Box>
          </HStack>
          <HStack p='4' align='center' boxShadow={'sm'} borderRadius={'md'} my='2' spacing='4' cursor='pointer' onClick={(()=>{router.push(`/dashboard/support/privacy?uid=${user?.data?.data?._id}`)})}>
            <Icon as={MdOutlinePrivacyTip} boxSize='6' color='gray.400'/>
            <Box>
              <Text fontWeight={'bold'} fontSize={'lg'}>Privacy Policy</Text>
              <Text>Read how we collect, store and use your personal data.</Text>
            </Box>
          </HStack>
        </GridItem>
      </Grid>
      <Box p='4' boxShadow={'sm'} my='4'>
        <Text fontSize='24px'>Our Contacts</Text>
        <HStack p='4' align='center' my='2' spacing='4'>
          <Icon as={FaPhoneAlt} boxSize='4' color='gray.400'/>
          <Link href="tel:0771712005">0771712005</Link>
        </HStack>
        <HStack p='4' align='center' my='2' spacing='4'>
          <Icon as={MdEmail} boxSize='4' color='gray.400'/>
          <Link href='mailto:support@vendar.shop'>support@vendar.shop</Link>
        </HStack>
      </Box>
    </Box>
  )
}

export default Page