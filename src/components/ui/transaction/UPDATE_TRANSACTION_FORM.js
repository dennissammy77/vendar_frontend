'use client'
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { Button, Divider, Flex, FormControl, FormLabel, HStack, Icon, Input, Select, Spinner, Switch, Text, Textarea, useToast } from '@chakra-ui/react';
import { CiWarning } from 'react-icons/ci';
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { UPDATE_STORE_TRANSACTION } from '@/app/api/transaction/route';
import { TbTruckDelivery } from 'react-icons/tb';
import { IoIosPerson } from 'react-icons/io';
import { GrMoney } from 'react-icons/gr';

export default function UPDATE_TRANSACTION_FORM(props) {

    const toast = useToast();
    const router = useRouter();

    const {user} = useContext(UserContext);

    const USER_ID = user?.data?.data?._id;
    const PRODUCT_ID = props?.TRANSACTION_DATA?.product_ref?._id;
    const TRANSACTION_ID = props?.TRANSACTION_DATA?._id;

    const [delivery_state_handler,set_delivery_state_handler]=useState(props?.TRANSACTION_DATA?.delivery_status);


    const schema = yup.object().shape({
        items: yup.number().min(1).required(),
        price: yup.number(),
        delivery_status: yup.boolean(),
        delivery_fee: yup.number().min(0),
        delivery_comment: yup.string(),
        delivery_person_name: yup.string(),
        delivery_person_contact: yup.string(),
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
        defaultValues:{
            items: props?.TRANSACTION_DATA?.items,
            price: props?.TRANSACTION_DATA?.price,
            delivery_status: props?.TRANSACTION_DATA?.delivery_status,
            delivery_fee: props?.TRANSACTION_DATA?.delivery_fee,
            delivery_comment: props?.TRANSACTION_DATA?.delivery_comment,
            delivery_person_name: props?.TRANSACTION_DATA?.delivery_person_name,
            delivery_person_contact: props?.TRANSACTION_DATA?.delivery_person_contact,
            status: props?.TRANSACTION_DATA?.status,
            payment: props?.TRANSACTION_DATA?.payment,
            payment_method: props?.TRANSACTION_DATA?.payment_method,
            payment_code: props?.TRANSACTION_DATA?.payment_code,
            customer_notification_status: false,
        }
    });

    const onSubmit = async(data) => {
        console.log(data)
        const payload = {
            items: data?.items,
			price: data?.price,
			delivery_status: data?.delivery_status,
			delivery_fee: data?.delivery_fee,
			delivery_comment: data?.delivery_comment,
			delivery_person_name: data?.delivery_person_name,
			delivery_person_contact: data?.delivery_person_contact,
            status: data?.payment ? 'paid' : 'unpaid',
			payment: data?.payment,
			payment_method: data?.payment_method,
			payment_code: data?.payment_code,
			customer_notification_status: data?.customer_notification_status
        };
        try {
          await UPDATE_STORE_TRANSACTION(payload,USER_ID, PRODUCT_ID, TRANSACTION_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Transaction updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
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
            <FormControl mt='1' isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Price</FormLabel>
                <Input disabled={isSubmitting} {...register('price')} type='number' placeholder='200' variant='filled'/>
                {errors.price && ( <Text fontSize={'sm'} color='red'>{errors.price.message}</Text>)}
            </FormControl>
            <FormControl isRequired>
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
                </>
            )}
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
                <Button isLoading loadingText='updating your transaction' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Save Transaction</Button>
            }
      </form>
    )
}