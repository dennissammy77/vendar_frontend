'use client'

import React, { useContext, useState } from 'react';
// utils
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import moment from 'moment';
// styling
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, IconButton, Select, FormControl, FormLabel, Wrap, useToast } from '@chakra-ui/react'
// icons
import { ADD_ICON, CALENDER_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, CLEAR_FILTER_ICON, EXPORT_ICON, FILTER_ICON, FILTER_ICON_CLOSE, MANAGE_ICON, SEARCH_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_ALL_STORE_TRANSACTION_DATA_FOR_EXPORT, FETCH_STORE_TRANSACTIONS_DATA } from '@/app/api/transaction/route';
// components
import PAGINATION_BODY from '@/components/ui/utils/pagination';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import DATA_LOADING from '@/components/ui/handlers/data.loading';
import Link from 'next/link';
import { PRIMARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';
import { EXPORT_TRANSACTIONS_EXCEL } from '@/components/hooks/export/EXCEL';
// functions

export default function Page() {
    // utils
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    // config
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;
    // filter options
    const [search_query, set_search_query]=useState('');
    const [show_filter_options,set_show_filter_options] = useState(false);
    const [status_filter,set_status_filter] = useState('none');
	const [to_date,set_to_date]=useState('none');
	const [from_date,set_from_date]=useState('none');
    const [page,set_page] = useState(1);
    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['store_transactions', {STORE_ID,USER_ID,search_query,status_filter,from_date,to_date,page}],
        queryFn: () => FETCH_STORE_TRANSACTIONS_DATA(USER_ID,STORE_ID,search_query,status_filter,from_date,to_date,page)
    });

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

    const Clear_Filters=()=>{
        set_show_filter_options(false)
        set_search_query('');
        set_status_filter('none');
        set_from_date('none');
        set_to_date('none');
    }

    const HANDLE_EXPORT_DATA = async()=>{
        const ALL_TRANSACTIONS = await FETCH_ALL_STORE_TRANSACTION_DATA_FOR_EXPORT(USER_ID,STORE_ID);
        toast({ title: 'Exporting TRANSACTIONS', description: `Please wait`, status: 'loading', variant: 'left-accent', position:'top-left',isClosable: true, duration: 1000 });
        await EXPORT_TRANSACTIONS_EXCEL(ALL_TRANSACTIONS?.data?.data)
        .then(()=>{
            toast({ title: 'Success!', description: `TRANSACTIONS exported successfully`, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            return;
        }).catch((err)=>{
            toast({ title: `${err}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
            throw new Error('Error')
        })
    }

    const TRANSACTION_DATA = data?.data?.data;
    const TRANSACTION_DATA_COUNT = data?.data?.count;

    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Transactions</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search transactions'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Link href={`/dashboard/transactions/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>
                        <Button bgColor={PRIMARY_BRAND} color='#ffffff' leftIcon={<ADD_ICON />}>New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Transactions</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box  boxShadow={'md'} p='2'>
                <Flex align='center' justify={'space-between'} my='2'>
                    <IconButton aria-label='filter' icon={show_filter_options? <FILTER_ICON_CLOSE/> : <FILTER_ICON />} size='sm' onClick={(()=>{set_show_filter_options(!show_filter_options)})}/>
                    <Flex gap='4' mx='2'>
                        <HStack onClick={HANDLE_EXPORT_DATA} align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                            <Icon as={EXPORT_ICON} boxSize={'4'}/>
                            <Text fontWeight={'bold'} fontSize={'sm'}>export</Text>
                        </HStack>
                    </Flex>
                </Flex>
                {show_filter_options && (
                    <Flex spacing='2' my='2' p='2' gap='2' flexDirection={{base:'column',md:'row'}} w={{base:'full',md:''}} align='center'>
                        <FormControl>
                            <FormLabel fontSize={'sm'}>Payment status</FormLabel>
                            <Select variant='outline' onChange={((e)=>{set_status_filter(e.target.value)})}>
                                <option value='' selected disabled hidden>Status</option>
                                <option value={'paid'}>Paid</option>
                                <option value={'pending'}>Pending</option>
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
                    <Text fontSize={'xs'} my='2' color='gray.400' pl='2' borderRight={'1px solid'} borderRightColor={TERTIARY_BRAND}>showing {TRANSACTION_DATA?.length || 0}  of {TRANSACTION_DATA_COUNT? TRANSACTION_DATA_COUNT : 0} items</Text>
                </HStack>
                <Wrap align={'center'}>
                    {status_filter !== 'none' && (<Button fontWeight={''} m='2'  variant='outline' >{status_filter}</Button>)}
                    {from_date !== 'none' || to_date !== 'none' ? (<Button fontWeight={''} m='2'  variant='outline' leftIcon={<CALENDER_ICON/>}>[{moment(from_date).format("DD MMM YY")}] - [{moment(to_date).format("DD MMM YY")}]</Button>) : null}
                    {status_filter !== 'none' || from_date !== 'none' || to_date !== 'none' ? <Icon as={CLEAR_FILTER_ICON} boxSize={'5'} color='red' onClick={Clear_Filters} cursor={'pointer'}/>: null}
                </Wrap>
                {TRANSACTION_DATA?.length === 0? 
                        <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                            <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
                            <Text>No transactions found!.</Text>
                        </Flex>
                    :
                    <TableContainer>
                        {isLoading?
                            <DATA_LOADING message={'Fetching store transactions'}/>
                            :
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
                                                    <Link href={`/dashboard/transactions/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&transaction_id=${transaction?._id}`}>
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