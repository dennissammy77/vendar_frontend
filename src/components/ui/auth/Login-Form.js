'use client'

import { Box, Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import React, { use, useContext, useState } from 'react'
import CardWrapper from './CardWrapper'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

import { MdVisibility,MdVisibilityOff } from "react-icons/md";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
//import SignIn from '@/api/auth/signin/route';
import { UserContext } from '@/components/providers/user.context';

const LoginForm=()=>{
  const router = useRouter();
  const [email, set_email]=useState('');
  const [password, set_password]=useState('');
  const [input_error, set_input_error]=useState(false);
  const [isPending, startTransition] = useTransition();
  const {set_user_handler} = useContext(UserContext)

  const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password 

  const payload={
    email,
    password,
  }
  const Verify_Inputs=()=>{
		const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (password && email){
			if (!email.match(validRegex)){
        return toast({ title: 'Error!:Use a valid email format e.g example@company.com', description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
			}else{
				//handle_Sign_In()
			}
		}else{
			set_input_error(true);
      return toast({ title: 'Error!:Required fields need to be filled', description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
		}
	}
	const handle_Sign_In=async()=>{
		await SignIn(payload).then((response)=>{
        toast({ title: 'Success!:SignIn successfull', description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true }); 
        setTimeout(()=>{
          router.push('/')
        },2000)
        set_user_handler(response)
        return ;
    }).catch((err)=>{
        return toast({ title: 'Error while signing into your account', description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
    }).finally(()=>{
      set_input_error(false)
    })
	}

  const handleSubmit=()=>{
    startTransition(()=>{
      Verify_Inputs()
    })
  }
  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel='Dont have an account?'
      backButtonHref={'/signup'}
    >
      <FormControl mt='1' isRequired isInvalid={input_error && email == '' ? true : false}>
        <FormLabel>Email</FormLabel>
        <Input disabled={isPending} type='email' placeholder='johndoe@email.com ' variant='filled' required onChange={((e)=>{set_email(e.target.value)})}/>
        {input_error && email == '' ?  <FormErrorMessage>email is required.</FormErrorMessage> : ( null )}
      </FormControl>
      <FormControl mt='1' isRequired isInvalid={input_error && password == '' ? true : false}>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input disabled={isPending} pr='4.5rem' type={show ? 'text' : 'password'} placeholder='Enter password' variant='filled' required onChange={((e)=>{set_password(e.target.value)})} />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'> {show ? <MdVisibilityOff/> : <MdVisibility/>} </Button>
          </InputRightElement>
        </InputGroup>
        {input_error && password == '' ?  <FormErrorMessage>password is required.</FormErrorMessage> : ( null )}
      </FormControl>
      {isPending?
        <Button isLoading loadingText='Signing you in' variant='ghost' borderRadius={'md'} w='full'/>
        :
        <Button variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Login</Button>
      }
      <Text fontSize={'sm'} color='red' my='4' cursor={'pointer'} onClick={(()=>{router.push('/auth/password_reset')})}>Forgot password?</Text>
    </CardWrapper>
  )
}

export default LoginForm