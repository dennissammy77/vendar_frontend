'use client'

import React, { useContext, useState } from 'react';
// utils
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, Progress, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, Select, Wrap, useToast, IconButton, FormControl, FormLabel } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import moment from 'moment';
import Link from 'next/link';
// icons
import { ADD_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, CLEAR_FILTER_ICON, EXPORT_ICON, FILTER_ICON, FILTER_ICON_CLOSE, IMPORT_ICON, MANAGE_ICON, PRODUCT_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_ALL_STORE_PRODUCT_DATA_FOR_EXPORT, FETCH_STORE_PRODUCTS_DATA } from '@/app/api/product/route';
// hooks
import { EXPORT_PRODUCT_EXCEL } from '@/components/hooks/export/EXCEL';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
// components
import { PRIMARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';

export default function Page() {
    // util
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    const toast = useToast();
    // filter options
    const [search_query, set_search_query]=useState('');
    const [show_filter_options,set_show_filter_options] = useState(false);
    const [stock_filter,set_stock_filter] = useState('none');
    const [from_date,set_from_date] = useState('none');
    const [to_date,set_to_date] = useState('none');
    const [page,set_page] = useState(1);
    // configs
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;

    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['store_products', {STORE_ID,USER_ID,search_query,stock_filter,from_date,to_date,page}],
        queryFn: () => FETCH_STORE_PRODUCTS_DATA(USER_ID,STORE_ID,search_query,stock_filter,from_date,to_date,page),
        enabled: USER_ID !== undefined && STORE_ID !== undefined
    });
    
    const PRODUCTS_DATA = data?.data?.data;
    const PRODUCTS_COUNT = data?.data?.count;

    const Clear_Filters=()=>{
        set_show_filter_options(false)
        set_search_query('');
        set_stock_filter('none');
        set_from_date('none');
        set_to_date('none');
    }

    const HANDLE_EXPORT_DATA = async()=>{
        const ALL_PRODUCTS = await FETCH_ALL_STORE_PRODUCT_DATA_FOR_EXPORT(USER_ID,STORE_ID);
        toast({ title: 'Exporting Products', description: `Please wait`, status: 'loading', variant: 'left-accent', position:'top-left',isClosable: true, duration: 1000 });
        await EXPORT_PRODUCT_EXCEL(ALL_PRODUCTS?.data?.data)
        .then(()=>{
            toast({ title: 'Success!', description: `Products exported successfully`, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            return;
        }).catch((err)=>{
            toast({ title: `${err}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
            throw new Error('Error')
        })
    }

    const HANDLE_PAGE_CHANGE=(sign)=>{
        if (page === 1 && sign === '-'){
            set_page(1)
            return;
        }
        switch (sign) {
            case '+':
                set_page(page + 1)
                break;
            case '-':
                set_page(page - 1)
                break;
            default:
                set_page(1)
                break;
        }
    }

    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
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
                    <Link href={`/dashboard/products/new?uid=${USER_ID}&store_id=${STORE_ID}`}>
                        <Button bgColor={PRIMARY_BRAND} color='#ffffff' leftIcon={<ADD_ICON />}>New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Products</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box my='2' boxShadow={'md'} p='2'>
                <Flex align='center' justify={'space-between'}>
                    <IconButton aria-label='filter' icon={show_filter_options? <FILTER_ICON_CLOSE/> : <FILTER_ICON />} size='sm' onClick={(()=>{set_show_filter_options(!show_filter_options)})}/>
                    <Flex gap='4' mx='2'>
                        <Link href={`/dashboard/products/new/import?uid=${USER_ID}&store_id=${STORE_ID}`}>
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
                        <FormControl>
                            <FormLabel fontSize={'sm'}>Stock</FormLabel>
                            <Select variant='outline' onChange={((e)=>{set_stock_filter(e.target.value)})}>
                                <option value='' selected disabled hidden>Stock</option>
                                <option value='none'>All</option>
                                <option value='in_stock'>In stock</option>
                                <option value='low_of_stock'>Low stock</option>
                                <option value='out_of_stock'>Out of Stock</option>
                            </Select>
                        </FormControl>
                        <HStack align='center' spacing='2' color='gray.600' w='full'>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>From Date</FormLabel>
                                <Input placeholder='From Date' size='md' type='date' onChange={((e)=>{set_from_date(e.target.value)})}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>To Date</FormLabel>
                                <Input placeholder='To Date' size='md' type='date' onChange={((e)=>{set_to_date(e.target.value)})}/>
                            </FormControl>
                        </HStack>
                    </Flex>
                )}
                <HStack align='center'>
                    <HStack align='center' spacing='2' color='gray.600'>
                        <Icon as={CHEVRON_LEFT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('-'))}/>
                        <Text fontSize={'xs'}>{page}</Text>
                        <Icon as={CHEVRON_RIGHT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('+'))}/>
                    </HStack>
                    <Text fontSize={'xs'} my='2' color='gray.400' pl='2' borderRight={'1px solid'} borderRightColor={TERTIARY_BRAND}>showing {PRODUCTS_DATA?.length || 0}  of {PRODUCTS_COUNT? PRODUCTS_COUNT : 0} items</Text>
                </HStack>
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
                                    {PRODUCTS_DATA?.map((product)=>{
                                        return(
                                            <Tr key={product?._id} >
                                                <Td>
                                                    <HStack>
                                                        <Avatar size={'sm'} src='' name={product?.name}/>
                                                        <Link href={`/dashboard/products/view?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${product?._id}`}>
                                                            <Box transition={'.3s ease-in-out'} _hover={{bg:TERTIARY_BRAND}}>
                                                                <Text>{product?.name}</Text>
                                                                <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{product?.category}</Text>
                                                            </Box>
                                                        </Link>
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
                                                    <Link href={`/dashboard/products/view?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${product?._id}`}>
                                                        <HStack color='gray.600' cursor={'pointer'} pr='1'>
                                                            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                                            <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
                                                        </HStack>
                                                    </Link>
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