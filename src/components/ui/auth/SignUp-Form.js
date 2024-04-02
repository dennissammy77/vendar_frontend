'use client'

import { Box, Button, Flex, HStack, Icon, Input, InputGroup, InputRightElement, Select, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react';
import CardWrapper from './CardWrapper';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import {
  FormControl,
  FormLabel, 
} from '@chakra-ui/react';

import { MdVisibility,MdVisibilityOff } from "react-icons/md"; 
import { CiWarning } from "react-icons/ci";
import { UserContext } from '@/components/providers/user.context';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import SignUpApi from '@/app/api/auth/route';

const SignUpForm=()=>{
  const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // schema for yup validation
  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required().matches(EmailRegex, 'Email address must be of correct format'),
    mobile: yup.string().required(),
    password: yup.string().required().min(6).max(16),
    account_type: yup.string().default('shop_admin').required(),
    profile_image_url: yup.string().default('')
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const {set_user_handler} = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();

  const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password
  useEffect(()=>{
    router.prefetch('/onboarding/newstore');
  },[])
  const onSubmit = async(data) => {
    try {
      await SignUpApi(data).then((response)=>{
          toast({ title: 'Success!:Account created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
          setTimeout(()=>{
            router.push('/onboarding/newstore');
          },2000)
          set_user_handler(response)
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
      headerLabel='Create an Account today'
      backButtonLabel='Already have an account?'
      backButtonHref={'/signin'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt='1' isRequired>
          <FormLabel>Name</FormLabel>
          <Input disabled={isSubmitting} {...register('name',{
            required: "Name is required",
          })} type='text' placeholder='John Doe' variant='filled'/>
          {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
        </FormControl>
        <FormControl mt='1' isRequired>
          <FormLabel>Email</FormLabel>
          <Input disabled={isSubmitting} {...register('email',{
            required: "Email is required",
            validate: (value)=>{
              if (!value.includes('@')){
                return "Email must include @";
              }
              if (!value.includes('.com')){
                return "Email must include.com";
              }
              if (!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
                return "Email must be of a valid address";
              }
            }
          })} type='email' placeholder='johndoe@gmail.com' variant='filled'/>
          {errors.email && ( <Text fontSize={'sm'} color='red'>{errors.email.message}</Text>)}
        </FormControl>
        <FormControl mt='1' isRequired>
          <FormLabel>Mobile</FormLabel>
          <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
          {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
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
          <Button isLoading loadingText='creating your account' variant='ghost' borderRadius={'md'} w='full'/>
          :
          <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>SignUp</Button>
        }
      </form>
    </CardWrapper>
  )
}

export default SignUpForm;