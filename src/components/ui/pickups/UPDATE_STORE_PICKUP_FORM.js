'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import React from 'react'
import { Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Icon, Input, Select, Text, Textarea, useToast } from '@chakra-ui/react';
import { CALENDER_ICON, MONEY_COINS_ICON, PERSON_ICON, WARNING_ICON } from '@/components/lib/constants/icons';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { NEW_STORE_PICKUP, UPDATE_STORE_PICKUP } from '@/app/api/pickup/route';


export default function UPDATE_STORE_PICKUP_FORM(props) {
    // util
    const toast = useToast();
    const router = useRouter();
    // param
    
    const searchParams = useSearchParams()
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const PICKUP_ID = props?.PICKUP_ID;
    const USER_ID = props?.USER_ID;
    const FLAG = 'details';
    // config


    const SCHEMA = yup.object().shape({
        name: yup.string().required("Name of the item is required"),
        price: yup.number().min(0).required('Price details for the item is required'),
        items: yup.number().min(1).required(),
        comment: yup.string(),
        customer_name: yup.string(),
        customer_mobile: yup.string(),
        payment_status: yup.boolean().required(),
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
            name: props?.PICKUP_DATA?.name,
            price: props?.PICKUP_DATA?.price,
            items: props?.PICKUP_DATA?.items,
            comment: props?.PICKUP_DATA?.comment,
            customer_name: props?.PICKUP_DATA?.customer_name,
            customer_mobile: props?.PICKUP_DATA?.customer_mobile,
            payment_status: props?.PICKUP_DATA?.payment_status,
            payment_method: props?.PICKUP_DATA?.payment_method,
            payment_code: props?.PICKUP_DATA?.payment_code,
            on_the_go_client_name: props?.PICKUP_DATA?.on_the_go_client_name,
            on_the_go_client_mobile:props?.PICKUP_DATA?.on_the_go_client_mobile,
            pickup_date: props?.PICKUP_DATA?.pickup_date,
            pickup_status: props?.PICKUP_DATA?.pickup_status,
            pickup_stage: props?.PICKUP_DATA?.pickup_stage,
        }
    });

    const onSubmit = async(data) => {
        try {
          await UPDATE_STORE_PICKUP(data,STORE_ID,USER_ID,PICKUP_ID,FLAG).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:PickUp updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            router.back();
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
                <Icon as={MONEY_COINS_ICON} boxSize={'4'} />
                <Text fontWeight={'bold'} fontSize='lg'>Payment Details</Text>
            </HStack>
            <Divider/>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Status</FormLabel>
                <Select {...register("payment_status")}>
                    <option value="" selected disabled hidden>Select Payment status</option>
                    <option value={false}>Product is pending payment</option>
                    <option value={true}>Product has been paid</option>
                </Select>
                {errors.payment && (<FormErrorMessage>{errors.payment.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl>
                <FormLabel my='2' fontWeight={'bold'}>Mode of payment</FormLabel>
                <Select {...register("payment_method")} placeholder='Payment method'>
                    <option value={'cash'}>Cash</option>
                    <option value={'mpesa'}>Mpesa</option>
                    <option value={'bank'}>Bank</option>
                </Select>
                {errors.payment_method && (<FormErrorMessage>{errors.payment_method.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl mt='2'>
                <FormLabel>Code Reference</FormLabel>
                <Input disabled={isSubmitting} {...register('payment_code')} type='text' placeholder='eg. X032JDSONJU32' variant='filled'/>
                {errors.payment_code && ( <Text fontSize={'sm'} color='red'>{errors.payment_code.message}</Text>)}
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
                <Text fontWeight={'bold'}>PICKUP Date</Text>
            </HStack>
            <Divider />
            <FormControl isRequired my='2'>
                <FormLabel>Date</FormLabel>
                <Input disabled={isSubmitting} type='date' variant={'outline'} {...register('pickup_date')} min={new Date().toISOString().split('T')[0]}/>
                <FormErrorMessage>{errors.pickup_date?.message}</FormErrorMessage>
            </FormControl>
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={WARNING_ICON} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='saving your item...' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Item</Button>
            }
        </form>
    )
};