'use client'

import React, { useContext, useState } from 'react';
// utils
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// api
import { NEW_STORE_TRANSACTION } from '@/app/api/transaction/route';
// components
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
// styling
import { Box, Button, Collapse, Divider, Flex, FormControl, FormLabel, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { CiWarning } from 'react-icons/ci';
import { TbTruckDelivery } from "react-icons/tb";
import { IoIosPerson } from 'react-icons/io';
import { GrMoney } from 'react-icons/gr';
import { PRODUCT_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';
import { IoClose } from 'react-icons/io5';
import { FETCH_ALL_STORE_PRODUCT_DATA_FOR_SEARCH } from '@/app/api/product/route';
import { BASE_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';

export default function NEW_TRANSACTION_FORM() {
    // utils
    const toast = useToast();
    const router = useRouter()
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    // api
    // components
    // styling
    // hooks
    // context
    // config
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;
    const PRODUCT_SEARCH_DISCLOSURE = useDisclosure();

    // state handlesrs
    const [delivery_state_handler,set_delivery_state_handler]=useState(null);
    const [search_query,set_search_query]=useState('');

    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID,USER_ID,search_query}],
        queryFn: () => FETCH_ALL_STORE_PRODUCT_DATA_FOR_SEARCH(USER_ID,STORE_ID,search_query),
        enabled: USER_ID !== undefined && STORE_ID !== undefined
    });
    
    const PRODUCTS_DATA = data?.data?.data;

    const [SELECTED_PRODUCT,SET_SELECTED_PRODUCT]=useState('');
    const PRODUCT_ID = SELECTED_PRODUCT?._id;
    const schema = yup.object().shape({
        items: yup.number().min(1).required(),
        delivery_status: yup.boolean(),
        delivery_fee: yup.number().min(0),
        delivery_comment: yup.string(),
        delivery_person_name: yup.string(),
        delivery_person_contact: yup.string(),
        status: yup.string(),
        payment: yup.boolean().required(),
        payment_method: yup.string(),
        payment_code: yup.string(),
        customer_notification_status: yup.boolean()
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues:{
            delivery_status: false,
            delivery_fee: 0,
            delivery_comment: 'N/A',
            delivery_person_name: 'N/A',
            delivery_person_contact: 'N/A',
            payment_method: 'N/A',
            payment_code: 'N/A',
            customer_notification_status: false
        }
    });

    const onSubmit = async(data) => {
        const payload = {
            items: data?.items,
            delivery_status: data?.delivery_status,
            delivery_fee: data?.delivery_status ? data?.delivery_fee : 0,
            delivery_comment: data?.delivery_status ? data?.delivery_comment : 'N/A',
            delivery_person_name: data?.delivery_status? data?.delivery_person_name : 'N/A',
            delivery_person_contact: data?.delivery_status? data?.delivery_person_contact: 'N/A',
            status: data?.payment ? 'paid' : 'unpaid',
            payment: data?.payment,
            payment_method: data?.payment ? data?.payment_method : 'N/A',
            payment_code: data?.payment_method === 'mpesa' ? data?.payment_code : 'N/A',
            customer_notification_status: false,
        };
        try {
          await NEW_STORE_TRANSACTION(payload,USER_ID, PRODUCT_ID, STORE_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Transaction created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            router.back();
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
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Product</FormLabel>
                {SELECTED_PRODUCT?.name?.length > 0 ? 
                    <Flex boxShadow={'sm'} bg={TERTIARY_BRAND} borderRadius={'sm'} justify={'space-between'} align={'center'} p='2'>
                        <Text fontWeight={'bold'} fontSize={'lg'}>({SELECTED_PRODUCT?.items})-{SELECTED_PRODUCT?.name}</Text>
                        <Text cursor={'pointer'} fontSize={'sm'} onClick={(()=>{SET_SELECTED_PRODUCT({})})}>change product</Text>
                    </Flex>
                        :
                    <Box position={'relative'}>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                            </InputLeftElement>
                            <Input type='search' placeholder={'Search products'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                        </InputGroup>
                        <Box boxShadow={'md'} p='4' borderRadius={'md'} bg={BASE_BRAND} display={search_query?.length > 0 ? '' : 'none'} position={'absolute'} top={50} left={0} zIndex={200} w='full'>
                            {PRODUCTS_DATA?.length === 0? 
                                    <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='40vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                        <Icon as={PRODUCT_ICON} boxSize={'6'}/>
                                        <Text>No products found!.</Text>
                                    </Flex>
                                :
                                <>
                                    {PRODUCTS_DATA?.map((product)=>{
                                        return(
                                            <Text key={product?._id} boxShadow={'sm'} bg={TERTIARY_BRAND} cursor='pointer' my='2' p='2' borderRadius={'sm'} onClick={(()=>{SET_SELECTED_PRODUCT(product);set_search_query('')})}>
                                                ({product?.items})-
                                                {product?.name}
                                            </Text>
                                        )
                                    })}
                                </>
                            }
                        </Box>
                    </Box>
                }
            </FormControl>
            <FormControl>
                <FormLabel my='2' fontWeight={'bold'}>Items Sold</FormLabel>
                <Input type='number' disabled={isSubmitting} {...register("items")} placeholder='1' variant={'filled'}/>
                {errors.items && ( <Text fontSize={'sm'} color='red'>{errors.items.message}</Text>)}
            </FormControl>
            <HStack align='center' spacing='2'>
                <Icon as={TbTruckDelivery} boxSize={'6'}/>
                <Text my='4' fontWeight={'bold'}>Delivery Details</Text>
            </HStack>
            <Divider/>
            <FormControl my='4' isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Status</FormLabel>
                <Select {...register("delivery_status")} onChange={((e)=>{set_delivery_state_handler(JSON.parse(e.target.value))})}>
                    <option value="" selected disabled hidden>Select Delivery status</option>
                    <option value={false}>Product is not being delivered</option>
                    <option value={true}>Product is being delivered</option>
                </Select>
            </FormControl>
            {delivery_state_handler && ( 
                <>
                    <FormControl mt='1' isRequired>
                        <FormLabel my='2' fontWeight={'bold'}>Fee</FormLabel>
                        <Input disabled={isSubmitting} {...register('delivery_fee')} type='number' placeholder='200' variant='filled'/>
                        {errors.delivery_fee && ( <Text fontSize={'sm'} color='red'>{errors.delivery_fee.message}</Text>)}
                    </FormControl>
                    <HStack align='center' spacing='2'>
                        <Icon as={IoIosPerson} boxSize={'6'}/>
                        <Text my='4' fontWeight={'bold'}>Rider Details</Text>
                    </HStack>
                    <FormControl mt='1'>
                        <FormLabel my='2' fontWeight={'bold'}>Name</FormLabel>
                        <Input disabled={isSubmitting} {...register('delivery_person_name')} type='text' placeholder='eg. X032JDSONJU32' variant='filled'/>
                        {errors.delivery_person_name && ( <Text fontSize={'sm'} color='red'>{errors.delivery_person_name.message}</Text>)}
                    </FormControl>
                    <FormControl mt='1'>
                        <FormLabel my='2' fontWeight={'bold'}>Mobile</FormLabel>
                        <Input disabled={isSubmitting} {...register('delivery_person_contact')} type='tel' placeholder='0712345678' variant='filled'/>
                        {errors.delivery_person_contact && ( <Text fontSize={'sm'} color='red'>{errors.delivery_person_contact.message}</Text>)}
                    </FormControl>
                    <FormControl mt='1'>
                        <FormLabel my='2' fontWeight={'bold'}>Comment</FormLabel>
                        <Textarea disabled={isSubmitting} {...register('delivery_comment')} type='text' placeholder='eg. Customer request immediate delivery' variant='filled'/>
                        {errors.delivery_comment && ( <Text fontSize={'sm'} color='red'>{errors.delivery_comment.message}</Text>)}
                    </FormControl>
                </>)}
            <HStack align='center' spacing='2'>
                <Icon as={GrMoney} boxSize={'6'}/>
                <Text my='4' fontWeight={'bold'}>Payment Details</Text>
            </HStack>
            <Divider/>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Status</FormLabel>
                <Select {...register("payment")}>
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
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your transaction' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create Transaction</Button>
            }
      </form>
    )
}