'use client'

import React, { useContext, useState } from 'react';
// utils
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, Progress, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, Select, Wrap, useToast, IconButton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import moment from 'moment';
import Cookies from 'universal-cookie';
// icons
import { ADD_ICON, CHEVRON_RIGHT_ICON, CLEAR_FILTER_ICON, EXPORT_ICON, FILTER_ICON, FILTER_ICON_CLOSE, IMPORT_ICON, MANAGE_ICON, PRODUCT_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_STORE_PRODUCTS_DATA } from '@/app/api/product/route';
// hooks
import { EXPORT_PRODUCT_EXCEL } from '@/components/hooks/export/EXCEL';
import Link from 'next/link';



export default function Page() {
    // util
    const router = useRouter();
    const {user} = useContext(UserContext);
    const cookies = new Cookies();
    const searchParams = useSearchParams();
    const toast = useToast();
    // filter options
    const [search_query, set_search_query]=useState('');
    const [show_filter_options,set_show_filter_options] = useState(false);
    const [stock_filter,set_stock_filter] = useState('none');
    const [from_date,set_from_date] = useState('none');
    const [to_date,set_to_date] = useState(Date.now());
    // configs
    const STORE_ID = cookies.get('active_store') || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;
    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID,USER_ID,search_query,stock_filter,from_date,to_date}],
        queryFn: () => FETCH_STORE_PRODUCTS_DATA(USER_ID,STORE_ID,search_query,stock_filter,from_date,to_date),
        enabled: USER_ID !== undefined && STORE_ID !== undefined
    });
    
    const PRODUCTS_DATA = data?.data?.data;

    const Clear_Filters=()=>{
        set_search_query('');
        set_stock_filter('none');
        set_from_date('none');
        set_to_date(Date.now());
    }

    const HANDLE_EXPORT_DATA = async()=>{
        toast({ title: 'Exporting Products', description: `Please wait`, status: 'loading', variant: 'left-accent', position:'top-left',isClosable: true, duration: 1000 });
        await EXPORT_PRODUCT_EXCEL(PRODUCTS_DATA)
        .then(()=>{
            toast({ title: 'Success!', description: `Products exported successfully`, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            return;
        }).catch((err)=>{
            toast({ title: `${err}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
            throw new Error('Error')
        })
    }

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
            {/**
             * Products data content starts Here
             */}
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                {/**
                 * Products tag & management goes here
                 * Search field, New product and product imports
                 */}
                <Text fontWeight='bold' fontSize='32px'>Products</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search products'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<ADD_ICON />} onClick={(()=>{router.push(`/dashboard/products/new?uid=${user?.data?.data?._id}&&store_id=${STORE_ID}`)})}>New</Button>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Products</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box  boxShadow={'md'} p='2'>
                <Flex align='center' justify={'space-between'}>
                    <IconButton aria-label='filter' icon={show_filter_options? <FILTER_ICON_CLOSE/> : <FILTER_ICON />} size='sm' onClick={(()=>{set_show_filter_options(!show_filter_options)})}/>
                    <Flex gap='4' mx='2'>
                        <Link href={`/dashboard/products/new/import?uid=${user?.data?.data?._id}&&store_id=${STORE_ID}`}>
                            <HStack align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                                <Icon as={IMPORT_ICON} boxSize={'4'}/>
                                <Text fontWeight={'bold'} fontSize={'sm'}>import</Text>
                            </HStack>
                        </Link>
                        <HStack onClick={HANDLE_EXPORT_DATA} align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                            <Icon as={EXPORT_ICON} boxSize={'4'}/>
                            <Text fontWeight={'bold'} fontSize={'sm'}>export</Text>
                        </HStack>
                    </Flex>
                </Flex>
                {show_filter_options && (
                    <Flex spacing='2' my='2' p='2' gap='2' flexDirection={{base:'column',md:'row'}} w={{base:'full',md:''}} align='center'>
                        {/**
                         * 
                        <Select variant='outline'>
                            <option value='' selected disabled hidden>Status</option>
                            <option value='approved'>Approved</option>
                            <option value='pending'>Pending</option>
                        </Select>
                            */}
                        <Select variant='outline' _placeholder={{ top: -10, color: 'gray.500' }} onChange={((e)=>{set_stock_filter(e.target.value)})}>
                            <option value='' selected disabled hidden>Stock</option>
                            <option value='none'>All</option>
                            <option value='in_stock'>In stock</option>
                            <option value='low_of_stock'>Low stock</option>
                            <option value='out_of_stock'>Out of Stock</option>
                        </Select>
                        <Input placeholder='From Date' size='md' type='date' onChange={((e)=>{set_from_date(e.target.value)})}/>
                        <Input placeholder='To Date' size='md' type='date' onChange={((e)=>{set_to_date(e.target.value)})}/>
                    </Flex>
                )}
                <Text fontSize={'xs'} my='2' color='gray.400'>showing {PRODUCTS_DATA?.length || 0} items</Text>
                <Wrap align={'center'}>
                    {stock_filter !== 'none' && (<Button fontWeight={''} m='2'  variant='outline' >{stock_filter}</Button>)}
                    {from_date !== 'none' && (<Button fontWeight={''} m='2'  variant='outline' >{from_date}</Button>)}
                    {stock_filter !== 'none'|| from_date !== 'none' ? <Icon as={CLEAR_FILTER_ICON} boxSize={'5'} color='red' onClick={Clear_Filters} cursor={'pointer'}/>: null}
                </Wrap>
                {PRODUCTS_DATA?.length === 0? 
                    <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                        <Icon as={PRODUCT_ICON} boxSize={'6'}/>
                        <Text>No products found!.</Text>
                    </Flex>
                :
                    <TableContainer>
                        {isLoading?
                            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh' w='full'>
                                <Spinner />
                                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store products</Text>
                            </Flex>
                        :
                        <Table variant='simple'>
                            <Thead bg='#E4F0FC'>
                                <Tr>
                                    <Th>Product</Th>
                                    <Th>Date</Th>
                                    <Th>Stock</Th>
                                    <Th>Price</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                                <Tbody>
                                    {PRODUCTS_DATA?.filter((product)=>product?.name?.toLowerCase().includes(search_query?.toLowerCase())).reverse()?.map((product)=>{
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
                                                    <Badge 
                                                        fontSize={'sm'}
                                                        colorScheme={product?.items === 0 ? 'orange':'purple'}
                                                    >
                                                        {product?.items === 0 ? 'out of stock' : `${product?.items} in stock`}
                                                    </Badge>
                                                </Td>
                                                <Td>KES {product?.price}</Td>
                                                <Td>
                                                    <Badge 
                                                        fontSize={'sm'}
                                                        colorScheme={product?.product_status?.approval_status ? 'green':'gray'}
                                                    >
                                                        {product?.product_status?.approval_status ? 'Approved':'pending'}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <HStack color='gray.600' cursor={'pointer'} pr='1' onClick={(()=>{router.push(`/dashboard/products/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&product_id=${product?._id}`)})}>
                                                        <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                                        <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        )})
                                    }
                                </Tbody>
                        </Table>
                        }
                    </TableContainer>
                }
            </Box>
        </Box>
    )
}