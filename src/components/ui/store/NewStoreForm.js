'use client'
import { UserContext } from '@/components/providers/user.context';
import { Button, FormControl, FormLabel, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { CreateNewStore } from '@/app/api/shop/route';
import { FaWandMagicSparkles } from 'react-icons/fa6';

export default function NewStoreForm() {
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const pathname = usePathname();
    const pathArr = pathname?.split('/');
    const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const schema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().max(200,'200 maximum character length allowed'),
        mobile: yup.string(),
        email: yup.string().email().matches(EmailRegex, 'Email address must be of correct format'),
        location: yup.string(),
        shelves: yup.number().min(1).required('Number of shelves is required')
    });
    useEffect(()=>{
        router.prefetch(`/dashboard/home?uid=${USER_ID}`);
    },[]);
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
            await CreateNewStore(data).then((response)=>{
                if(response?.data?.error){
                    return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                if(pathArr.some(path => path === 'onboarding')){
                    router.push(`/dashboard/home?uid=${USER_ID}`);
                }
                router.push(`/dashboard/stores?uid=${USER_ID}`);
                return ;
            }).catch((err)=>{
                return toast({ title: `Error`, description: `Could not create your store:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            })
        }catch(err){
            return toast({ title: `Error`, description: `Could not create your store:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }
  return (
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
            <FormLabel>Number of shelves</FormLabel>
            <Input disabled={isSubmitting} {...register('shelves')} type='number' placeholder='eg: 10' variant='filled'/>
            {errors.shelves && ( <Text fontSize={'sm'} color='red'>{errors.shelves.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>About the store</FormLabel>
            <Textarea h='100px' disabled={isSubmitting} {...register('description')} type='text' placeholder='Tell us a bit about your store' variant='filled'/>
            {errors.description && ( <Text fontSize={'sm'} color='red'>{errors.description.message}</Text>)}
        </FormControl>
        {isSubmitting?
            <Button isLoading loadingText='creating your store' variant='ghost' borderRadius={'md'} w='full'/>
            :
            <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit} leftIcon={<FaWandMagicSparkles />}>Create Store</Button>
        }
    </form>
  )
}