'use client'
import React from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, FormControl, FormLabel, Input, ListItem, OrderedList, Text, UnorderedList, useToast } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import { MdChevronRight } from 'react-icons/md';

import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { FETCH_PRODUCT_DATA, UPDATE_STORE_PRODUCT } from '@/app/api/product/route';


function Page() {

  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();

  const schema = yup.object().shape({
    items: yup.number().required().min(1).positive()
  });

  const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
  } = useForm({
      resolver: yupResolver(schema),
  });

  const USER_ID = searchParams.get('uid');
  const PRODUCT_ID = searchParams.get('product_id');
  const STORE_ID = searchParams.get('store_id');
  
  const {data:FETCHED_PRODUCT_DATA} = useQuery({
      queryKey: ['product data', {PRODUCT_ID}],
      queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
  });

  const PRODUCT_DATA =FETCHED_PRODUCT_DATA?.data?.data;

  const onSubmit = async(data) => {
    const FLAG = 'restock';
      try {
        await UPDATE_STORE_PRODUCT(data,STORE_ID,USER_ID,PRODUCT_ID,FLAG).then((response)=>{
          if(response?.data?.error === true){
              return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
          }
          toast({ title: 'Success!:Product updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
          router.back()
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
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Edit Product Data</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/product/view/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Product</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/product/edit/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>edit</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>restock</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <Box my='4'>
          <UnorderedList>
              <ListItem fontWeight={'bold'}>Name: {PRODUCT_DATA?.name}</ListItem>
              <ListItem fontWeight={'bold'}>Price: KES {PRODUCT_DATA?.price}</ListItem>
              <ListItem fontWeight={'bold'}>Category: {PRODUCT_DATA?.category}</ListItem>
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
          </UnorderedList>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mt='2' isRequired>
            <FormLabel fontSize='' fontWeight='bold'>How many items do you want to add?</FormLabel>
            <Input disabled={isSubmitting} {...register('items')} type='number' placeholder='number of items' variant='filled'/>
            {errors.items && ( <Text fontSize={'sm'} color='red'>{errors.items.message}</Text>)}
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