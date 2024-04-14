'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import { MdChevronRight } from 'react-icons/md';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import { FETCH_STORE_TRANSACTIONS_DATA } from '@/app/api/transaction/route';
import PAGINATION_BODY from '@/components/ui/utils/pagination';
import moment from 'moment';



export default function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const [search_query, set_search_query]=useState('')
	const [to_date,set_to_date]=useState(moment(new Date()).format("YYYY-MM-DD"));
	const [from_date,set_from_date]=useState(moment(new Date()).format("YYYY-MM-DD"));



    const searchParams = useSearchParams();
    const STORE_ID = searchParams.get('store_id');

    const {data, isLoading} = useQuery({
        queryKey: ['store_transactions', {STORE_ID,search_query}],
        queryFn: () => FETCH_STORE_TRANSACTIONS_DATA(STORE_ID)
    });

    const TRANSACTION_DATA = data?.data?.data;

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>Error occured fetching store transactions</Text>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Transactions</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search transactions'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/transactions/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`)})}>New</Button>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Transactions</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <HStack spacing='2' my='4'>
                {user?.data?.data?.store_ref?.map((store)=>{
                    return(
                        <Tag size={'md'} key={store?._id} variant='outline' borderRadius='full' colorScheme={store?._id === STORE_ID?'blue':null} cursor='pointer' onClick={(()=>{router.replace(`/dashboard/transactions?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>
                            <TagLeftIcon as={FaStore} />
                            <TagLabel>{store?.name}</TagLabel>
                        </Tag>
                    )
                })}
            </HStack>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store transactions</Text>
                </Flex>
                :
                <>
                    {TRANSACTION_DATA?.length > 0? 
                        <TableContainer boxShadow={'md'}>
                            <Table variant='simple'>
                                <Thead bg='#E4F0FC'>
                                    <Tr>
                                        <Th>Product</Th>
                                        <Th>Date</Th>
                                        <Th>Amount</Th>
                                        <Th>Vendor</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {TRANSACTION_DATA?.filter((transaction)=>transaction?.vendor?.name?.toLowerCase().includes(search_query?.toLowerCase()) || transaction?.product_ref?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((transaction)=>{
                                        return(
                                            <Tr key={transaction?._id} >
                                                <Td>
                                                    <HStack>
                                                        <Avatar size={'sm'} src='' name={transaction?.product_ref?.name}/>
                                                        <Box>
                                                            <Text>{transaction?.product_ref?.name}</Text>
                                                            <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{transaction?._id}</Text>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Box>
                                                        <Text fontWeight={''}>{moment(transaction?.createdAt).format("DD MMM YY")}</Text>
                                                        <Text fontSize={'sm'} color='gray.400'>{moment(transaction?.createdAt).format("h:mm a")}</Text>
                                                    </Box>
                                                </Td>
                                                <Td>KES {transaction?.payment_total}</Td>
                                                <Td><Text fontSize={'sm'}>{transaction?.vendor?.name}</Text></Td>
                                                <Td><Badge colorScheme={transaction?.payment? 'green':'orange'}>{transaction?.status}</Badge></Td>
                                                <Td>
                                                    <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/transactions/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&transaction_id=${transaction?._id}`)})}>
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
                    :
                        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh' textAlign={'center'}>
                            <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>No transactions found <br/>or<br/>Create a transaction.</Text>
                        </Flex>
                    }
                </>
            }
        </Box>
    )
}