'use client'

import { Box, Button, Icon, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import CardWrapper from './CardWrapper'
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { MdVisibility,MdVisibilityOff } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { UserContext } from '@/components/providers/user.context';
import { CiWarning } from 'react-icons/ci';
import { SignInApi } from '@/app/api/auth/route';

const LoginForm=()=>{
  const router = useRouter();
  const toast = useToast();
  const {set_user_handler} = useContext(UserContext)

  const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password 

  const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const schema = yup.object().shape({
    email: yup.string().email().required().matches(EmailRegex, 'Email address must be of correct format'),
    password: yup.string().required().min(6).max(16,'Password must be at most 16 characters'),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(()=>{
    router.prefetch('/dashboard/home');
  },[])
  const onSubmit = async(data) => {
    try {
      await SignInApi(data).then((response)=>{
          toast({ title: 'Success!:Sign In successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
          router.push('/dashboard/home');
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
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel='Dont have an account?'
      backButtonHref={'/signup'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt='1' isRequired>
          <FormLabel>Email</FormLabel>
          <Input disabled={isSubmitting} {...register('email')} type='email' placeholder='johndoe@gmail.com' variant='filled'/>
          {errors.email && ( <Text fontSize={'sm'} color='red'>{errors.email.message}</Text>)}
        </FormControl>
        <FormControl mt='1' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size='md'>
            <Input disabled={isSubmitting} {...register('password')} pr='4.5rem' type={show ? 'text' : 'password'} placeholder='Enter password' variant='filled'/>
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'> {show ? <MdVisibilityOff/> : <MdVisibility/>} </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && ( <Text fontSize={'sm'} color='red'>{errors.password.message}</Text>)}
        </FormControl>
        {errors.root && <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}><Icon as={CiWarning} boxSize='4'/> <Text>{errors.root.message}</Text></HStack>}
        {isSubmitting?
          <Button isLoading loadingText='Signing you in' variant='ghost' borderRadius={'md'} w='full'/>
          :
          <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>SignIn</Button>
        }
      </form>
      <Text fontSize={'sm'} color='red' my='4' cursor={'pointer'} onClick={(()=>{router.push('/password_reset')})}>Forgot password?</Text>
    </CardWrapper>
  )
}

export default LoginForm