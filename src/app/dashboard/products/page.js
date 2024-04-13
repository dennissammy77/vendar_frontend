'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import { MdChevronRight } from 'react-icons/md';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import { FETCH_STORE_PRODUCTS_DATA } from '@/app/api/product/route';


export default function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const [search_query, set_search_query]=useState('')


    const searchParams = useSearchParams();
    const STORE_ID = searchParams.get('store_id');

    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID,search_query}],
        queryFn: () => FETCH_STORE_PRODUCTS_DATA(STORE_ID)
    });

    const PRODUCTS_DATA = data?.data?.data;

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>Error occured fetching store products</Text>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Products</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search products'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/products/new?uid=${user?.data?.data?._id}&&store_id=${STORE_ID}`)})}>New</Button>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Products</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <HStack spacing='2' my='4'>
                {user?.data?.data?.store_ref?.map((store)=>{
                    return(
                        <Tag size={'md'} key={store?._id} variant='outline' borderRadius='full' colorScheme={store?._id === STORE_ID?'blue':null} cursor='pointer' onClick={(()=>{router.replace(`/dashboard/products?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>
                            <TagLeftIcon as={FaStore} />
                            <TagLabel>{store?.name}</TagLabel>
                        </Tag>
                    )
                })}
            </HStack>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store products</Text>
                </Flex>
                :
                <>
                    {PRODUCTS_DATA?.filter((product)=>product?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((product)=>{
                        return(
                            <Box key={product?._id} py='2'>
                                <ProductItem product={product} STORE_ID={STORE_ID}/>
                                <Divider py='1'/>
                            </Box>
                        )})
                    }
                </>
            }
        </Box>
    )
}

const ProductItem=({product,STORE_ID})=>{
    const router = useRouter();
    const {user} = useContext(UserContext)
  
    return(
      <Flex py='2' px='4' borderRadius={'5'} align={'center'} justify={'space-between'} transition={'.3s ease-in-out'} _hover={{bg:'gray.100'}} cursor={'pointer'}>
        <HStack spacing='2' >
          <Box>
            <Text fontSize={'md'} fontWeight={'bold'}>{product?.name}</Text>
            <Text fontSize={'sm'} color='gray.600' my='1'>{product?.price}</Text>
            <Text fontSize={'xs'} color='gray.400'>{product?.category}</Text>
          </Box>
        </HStack>
        <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/products/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&product_id=${product?._id}`)})}>
            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
            <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
        </HStack>
      </Flex>
    )
  }