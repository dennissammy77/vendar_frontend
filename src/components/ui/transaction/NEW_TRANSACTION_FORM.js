'use client'
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { Button, Flex, FormControl, FormLabel, HStack, Icon, Input, Select, Spinner, Switch, Text, useToast } from '@chakra-ui/react';
import { CiWarning } from 'react-icons/ci';
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { NEW_STORE_STAKEHOLDER_ACCOUNT } from '@/app/api/auth/route';
import { FETCH_STORE_PRODUCTS_DATA } from '@/app/api/product/route';
import { useQuery } from '@tanstack/react-query';
import { NEW_STORE_TRANSACTION } from '@/app/api/transaction/route';

export default function NEW_TRANSACTION_FORM() {

    const toast = useToast();
    const router = useRouter()

    const {user} = useContext(UserContext);
    const EXISTING_STORES = user?.data?.data?.store_ref;

    const searchParams = useSearchParams();
    const STORE_ID = searchParams.get('store_id');

    const USER_ID = user?.data?.data?._id;

    const [PRODUCT_DATA,SET_PRODUCT_DATA]=useState('');
    const [PRODUCT_ID,SET_PRODUCT_ID]=useState('');

    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID}],
        queryFn: () => FETCH_STORE_PRODUCTS_DATA(STORE_ID)
    });

    const PRODUCTS_DATA = data?.data?.data;

    const schema = yup.object().shape({
        delivery_status: yup.boolean(),
        delivery_fee: yup.number().min(0),
        status: yup.string(),
        payment: yup.boolean(),
        payment_method: yup.string(),
        payment_code: yup.string(),
        payment_total: yup.number().min(0),
        customer_notification_status: yup.boolean()
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
        const payload = {
            delivery_status: data?.delivery_status,
            delivery_fee: data?.delivery_fee,
            status: data?.payment ? 'paid' : 'unpaid',
            payment: data?.payment,
            payment_method: data?.payment_method,
            payment_code: data?.payment_code,
            payment_total: data?.payment_total,
            customer_notification_status: false,
        };
        try {
          await NEW_STORE_TRANSACTION(payload,USER_ID, PRODUCT_ID, STORE_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Transaction created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                router.back()
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
        <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading? 
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting Up transaction form</Text>
                </Flex>
            :
                <FormControl isRequired>
                    <FormLabel my='2' fontWeight={'bold'}>Product</FormLabel>
                    <Select 
                        placeholder='Select the product' 
                        onChange={((e)=>{
                            SET_PRODUCT_ID(e.target.value);
                        })}>
                        {PRODUCTS_DATA?.map((product)=>{
                            return(
                                <option value={product?._id} key={product?._id}>{product?.name}</option>
                            )
                        })}
                    </Select>
                </FormControl>
            }
            <FormControl my='4' isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Delivery status</FormLabel>
                <Select {...register("delivery_status")} placeholder='Delivery status'>
                    <option value={false}>Product is not being delivered</option>
                    <option value={true}>Product is being delivered</option>
                </Select>
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Delivery fee</FormLabel>
                <Input disabled={isSubmitting} {...register('delivery_fee')} type='number' placeholder='200' variant='filled'/>
                {errors.delivery_fee && ( <Text fontSize={'sm'} color='red'>{errors.delivery_fee.message}</Text>)}
            </FormControl>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Payment status</FormLabel>
                <Select {...register("payment")} placeholder='Payment status'>
                    <option value={false}>Product is pending payment</option>
                    <option value={true}>Product has been paid</option>
                </Select>
                {errors.payment && (<FormErrorMessage>{errors.payment.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Payment Method</FormLabel>
                <Select {...register("payment_method")} placeholder='Payment method'>
                    <option value={'cash'}>Cash</option>
                    <option value={'mpesa'}>Mpesa</option>
                    <option value={'bank'}>Bank</option>
                </Select>
                {errors.payment_method && (<FormErrorMessage>{errors.payment_method.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl mt='1'>
                <FormLabel>Payment Code</FormLabel>
                <Input disabled={isSubmitting} {...register('payment_code')} type='text' placeholder='eg. X032JDSONJU32' variant='filled'/>
                {errors.payment_code && ( <Text fontSize={'sm'} color='red'>{errors.payment_code.message}</Text>)}
            </FormControl>
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your account' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create Transaction</Button>
            }
      </form>
    )
}