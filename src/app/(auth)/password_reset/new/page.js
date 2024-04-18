'use client'

import LOGO from '@/app/lib/LOGO'
import { Button, Flex, FormControl, FormLabel, HStack, Icon, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CiWarning } from 'react-icons/ci'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { USER_PASSWORD_RESET_TO_NEW } from '@/app/api/auth/route'
import { useRouter, useSearchParams } from 'next/navigation'


function Page() {
    const router = useRouter();
    const toast = useToast();

    const searchParams = useSearchParams()
    const email = searchParams.get('email');

    const schema = yup.object().shape({
        new_password: yup.string().required().min(6).max(16),
        confirm_password: yup.string().required().min(6).max(16),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
      });

    const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password

    const onSubmit = async(data) => {
        try {
            if(data?.new_password.match(data?.confirm_password)){
                await USER_PASSWORD_RESET_TO_NEW(data,email).then((response)=>{
                        if(response?.data?.error === true){
                            return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
                        }
                        toast({ title: 'Success!:Password changed sent successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                        setTimeout(()=>{
                            router.push(`/signin`);
                        },2000)
                        return ;
                }).catch((err)=>{
                    return toast({ title: `Error occured!:`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                })
            }else{
                return toast({ title: `Error!:${'Passwords do not match'}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
        } catch (error){
            console.log(error)
            return toast({ title: `Error occured!:`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }
    
    return (
        <Flex direction='column' alignItems={'center'} justify={'center'} w='full' boxShadow={'sm'} p='4'>
            <Flex hideFrom='md' alignItems={'center'} flexDirection={'column'}>
                <LOGO color='#4E2FD7' size='20px'/>
            </Flex>
            <Text fontSize={'xl'} my='4'>Reset your password.</Text>
            {/**Email input to send code to */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl my='4' isRequired>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup size='md'>
                        <Input pr='4.5rem' {...register('new_password')} type={show ? 'text' : 'password'} placeholder='Enter password' variant='filled' required />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'>
                            {show ? <MdVisibilityOff/> : <MdVisibility/>}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {errors.new_password && ( <Text fontSize={'sm'} color='red'>{errors.new_password.message}</Text>)}
                </FormControl>
                <FormControl my='4' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size='md'>
                        <Input pr='4.5rem' {...register('confirm_password')} type={show ? 'text' : 'password'} placeholder='Enter password' variant='filled' required />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'>
                            {show ? <MdVisibilityOff/> : <MdVisibility/>}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {errors.confirm_password && ( <Text fontSize={'sm'} color='red'>{errors.confirm_password.message}</Text>)}
                </FormControl>
                {errors.root && 
                    <HStack color='#fff' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                        <Icon as={CiWarning} boxSize='4'/>
                        <Text>{errors.root.message}</Text>
                    </HStack>
                }
                {isSubmitting?
                    <Button isLoading loadingText='resetting your password...' variant='ghost' borderRadius={'md'} w='full'/>
                    :
                    <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Reset Password</Button>
                }
            </form>
        </Flex>
    )
}

export default Page