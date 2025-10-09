'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import React from 'react'
import { Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Icon, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import { CALENDER_ICON, MONEY_COINS_ICON, PERSON_ICON, WARNING_ICON } from '@/components/lib/constants/icons';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { NEW_STORE_PICKUP } from '@/app/api/pickup/route';


export default function NEW_STORE_PICKUP_FORM() {
    // util
    const toast = useToast();
    const router = useRouter();
    // param
    
    const searchParams = useSearchParams()
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    // config
    
    const SCHEMA = yup.object().shape({
        name: yup.string().required("Name of the item is required"),
        price: yup.number().min(0).required('Price details for the item is required'),
        items: yup.number().min(1).required(),
        comment: yup.string(),
        customer_name: yup.string(),
        customer_mobile: yup.string(),
        store_ref: yup.string().length(24, 'Store ID Format length validation error').required('Store ID is required'),
        payment_status: yup.boolean().required().default(false),
        payment_method: yup.string(),
        payment_code: yup.string(),
        on_the_go_client_name: yup.string().required(),
        on_the_go_client_mobile: yup.string().required(),
        pickup_date: yup.date().required(),
        pickup_status: yup.boolean().required(),
        pickup_stage: yup.string().required(),        
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(SCHEMA),
        defaultValues:{
            store_ref: STORE_ID,
            payment_status: false,
            payment_method: 'N/A',
            payment_code: 'N/A',
            pickup_status: false,
            pickup_stage: 'pending',
        }
    });

    const onSubmit = async(data) => {
        try {
          await NEW_STORE_PICKUP(data,STORE_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:PickUp created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                router.back()
            },2000)
            return ;
          }).catch((err)=>{
              return toast({ title: `${err}`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
          })
        } catch (error){
            console.log(error)
          setError("root", {
            message: error,
          });
          return;
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired my='2'>
                <FormLabel>Name of the item</FormLabel>
                <Input disabled={isSubmitting} type="text" variant={'outline'} {...register('name')} />
                {errors.name && (<FormErrorMessage>{errors.name?.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isRequired my='2'>
                <FormLabel>Price details for the item</FormLabel>
                <Input disabled={isSubmitting} type="number" variant={'outline'} {...register('price')} />
                {errors.price && (<FormErrorMessage>{errors.price?.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isRequired my='2'>
                <FormLabel>Number of items</FormLabel>
                <Input disabled={isSubmitting} type="number" variant={'outline'} {...register('items')} />
                {errors.items && (<FormErrorMessage>{errors.items?.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isRequired my='2'>
                <FormLabel>Comment</FormLabel>
                <Textarea type="text" variant={'outline'} h='200px' {...register('comment')} />
                {errors.comment && (<FormErrorMessage>{errors.comment?.message}</FormErrorMessage>)}
            </FormControl>
            <HStack align='center'>
                <Icon as={PERSON_ICON} boxSize={'4'} />
                <Text fontWeight={'bold'} fontSize='lg'>Customer Details</Text>
            </HStack>
            <Divider/>
            <FormControl isRequired my='2'>
                <FormLabel>Name</FormLabel>
                <Input disabled={isSubmitting} type='text' variant={'outline'} {...register('customer_name')}/>
                <FormErrorMessage>{errors.customer_name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired my='2'>
                <FormLabel>Mobile</FormLabel>
                <Input disabled={isSubmitting} type='text' variant={'outline'} {...register('customer_mobile')}/>
                <FormErrorMessage>{errors.customer_mobile?.message}</FormErrorMessage>
            </FormControl>
            <HStack align='center' spacing='2'>
                <Icon as={PERSON_ICON} boxSize={'4'}/>
                <Text my='4' fontWeight={'bold'}>Vendor Details</Text>
            </HStack>
            <Divider/>
            <FormControl isRequired my='2'>
                <FormLabel>Name</FormLabel>
                <Input disabled={isSubmitting} type='text' variant={'outline'} {...register('on_the_go_client_name')}/>
                <FormErrorMessage>{errors.on_the_go_client_name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired my='2'>
                <FormLabel>Mobile</FormLabel>
                <Input disabled={isSubmitting} type='text' variant={'outline'} {...register('on_the_go_client_mobile')}/>
                <FormErrorMessage>{errors.on_the_go_client_mobile?.message}</FormErrorMessage>
            </FormControl>
            <HStack align={'center'} my='2'>
                <Icon as={CALENDER_ICON} boxSize={'6'}/>
                <Text fontWeight={'bold'}>PickUp Date</Text>
            </HStack>
            <Divider />
            <FormControl isRequired my='2'>
                <FormLabel>Date</FormLabel>
                <Input disabled={isSubmitting} type='datetime-local' variant={'outline'} {...register('pickup_date')} min={new Date().toISOString().split('T')[0]}/>
                <FormErrorMessage>{errors.pickup_date?.message}</FormErrorMessage>
            </FormControl>
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={WARNING_ICON} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your pickup item' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create Item</Button>
            }
        </form>
    )
};