'use client'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, FormControl, FormErrorMessage, FormLabel, ListItem, OrderedList, Select, Text, UnorderedList, useToast } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { FETCH_PRODUCT_DATA, MOVE_STORE_PRODUCT_TO_STAKEHOLDER } from '@/app/api/product/route';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { MdChevronRight } from 'react-icons/md';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';

function Page() {
    
    const router = useRouter();
    const toast = useToast();
    const searchParams = useSearchParams()
    const USER_ID = searchParams.get('uid');
    const PRODUCT_ID = searchParams.get('product_id');
    const STORE_ID = searchParams.get('store_id');

    const ACCOUNT_TYPE = 'vendor';

    const {data:FETCHED_PRODUCT_DATA} = useQuery({
        queryKey: ['product data', {PRODUCT_ID}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });

    const PRODUCT_DATA =FETCHED_PRODUCT_DATA?.data?.data


    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE)
    });

    const VENDORS_DATA = data?.data?.data;

    const schema = yup.object().shape({
        vendor: yup.string().length(24, 'User ID Format length validation error').required('Vendor ID is required'),
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
        const ACCOUNT_ID = data?.vendor;
        alert(ACCOUNT_ID)
        try {
          await MOVE_STORE_PRODUCT_TO_STAKEHOLDER (STORE_ID,USER_ID,ACCOUNT_ID,PRODUCT_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Product updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
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
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    // Fetch All store users - done
    // Change Ownership of product
    // Feedback
    // Return to previous page done
    // notify user the contents of the product that will be moved
    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Product Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='4'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products/view/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Product</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products/edit/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>edit</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>management</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box p='2'>
                <Text>The Following information will be transfered and updated:</Text>
                <OrderedList>
                    <ListItem fontWeight={'bold'}>{PRODUCT_DATA?.transactions?.length} Transactions</ListItem>
                    <UnorderedList>
                        <ListItem>KES {PRODUCT_DATA?.transactions?.reduce(function(accumulator, currentValue) { return accumulator + currentValue.payment_total; }, 0)} worth of goods sold.</ListItem>
                    </UnorderedList>
                    <ListItem fontWeight={'bold'}>Current Owner</ListItem>
                    <UnorderedList>
                        <ListItem>Name: {PRODUCT_DATA?.owner_ref_id?.name}</ListItem>
                        <ListItem>Email: {PRODUCT_DATA?.owner_ref_id?.email}</ListItem>
                        <ListItem>Mobile: {PRODUCT_DATA?.owner_ref_id?.mobile}</ListItem>
                        <ListItem>Account: {PRODUCT_DATA?.owner_ref_id?.account_type}</ListItem>
                    </UnorderedList>
                    <ListItem fontWeight={'bold'}>{PRODUCT_DATA?.items} Stock(s)</ListItem>
                </OrderedList>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mt='1' isRequired>
                    <FormLabel fontSize={'xl'} fontWeight={'bold'}>Transfer Ownership</FormLabel>
                    <Divider />
                    <Select placeholder='Select the Vendor' {...register('vendor')} isDisabled={isSubmitting}>
                        {VENDORS_DATA?.map((vendor)=>{
                            return(
                                <option value={vendor?._id}>{vendor?.name}</option>
                            )
                        })}
                    </Select>
                    {errors.category && (<FormErrorMessage>{errors.category.message}</FormErrorMessage>)}
                </FormControl>
                {isSubmitting?
                    <Button isLoading loadingText='saving your product' variant='ghost' borderRadius={'md'} w='full'/>
                :
                    <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Product</Button>
                }
            </form>
        </Box>
    )
}

export default Page