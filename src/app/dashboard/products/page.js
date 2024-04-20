'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, Progress, TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import { MdChevronRight } from 'react-icons/md';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import { FETCH_STORE_PRODUCTS_DATA } from '@/app/api/product/route';
import moment from 'moment';


export default function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const [search_query, set_search_query]=useState('')


    const searchParams = useSearchParams();
    const STORE_ID = searchParams.get('store_id');
    const USER_ID = searchParams.get('uid');

    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID,search_query,USER_ID}],
        queryFn: () => FETCH_STORE_PRODUCTS_DATA(USER_ID,STORE_ID)
    });

    const PRODUCTS_DATA = data?.data?.data;
    //console.log(PRODUCTS_DATA[0]);

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
                    <TableContainer boxShadow={'md'}>
                        <Table variant='simple'>
                            <Thead bg='#E4F0FC'>
                                <Tr>
                                    <Th>Product</Th>
                                    <Th>Date</Th>
                                    <Th>Stock</Th>
                                    <Th>Price</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {PRODUCTS_DATA?.filter((product)=>product?.name?.toLowerCase().includes(search_query?.toLowerCase())).reverse()?.map((product)=>{
                                    const sold_products = product?.transactions?.reduce(
                                        (accumulator, currentValue) => accumulator + currentValue.items,
                                        0,
                                    );
                                    return(
                                        <Tr key={product?._id} >
                                            <Td>
                                                <HStack>
                                                    <Avatar size={'sm'} src='' name={product?.name}/>
                                                    <Box>
                                                        <Text>{product?.name}</Text>
                                                        <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{product?.category}</Text>
                                                    </Box>
                                                </HStack>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text fontWeight={''}>{moment(product?.createdAt).format("DD MMM YY")}</Text>
                                                    <Text fontSize={'sm'} color='gray.400'>{moment(product?.createdAt).format("h:mm a")}</Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Progress 
                                                    value={product?.items - sold_products}
                                                    colorScheme={product?.items - sold_products  === 0? 'orange' : 'green'} 
                                                    size={'xs'}
                                                    max={product?.items}
                                                />
                                                <Text fontSize={'sm'}>{product?.items - sold_products <= 0 ? 'out of stock' : `${product?.items - sold_products} in stock`}</Text>
                                            </Td>
                                            <Td>KES {product?.price}</Td>
                                            <Td>
                                                <HStack color='gray.600' cursor={'pointer'} pr='1' onClick={(()=>{router.push(`/dashboard/products/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&product_id=${product?._id}`)})}>
                                                    <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                                    <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    )})
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>
            }
        </Box>
    )
}