'use client'

import React, { useContext, useState } from 'react'
// utils
import { UserContext } from '@/components/providers/user.context';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

// icons
import { ADD_ICON, CALENDER_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, CLEAR_FILTER_ICON, EXPORT_ICON, FILTER_ICON, FILTER_ICON_CLOSE, IMPORT_ICON, MANAGE_ICON, PICKUPS_ICON, SEARCH_ICON } from '@/components/lib/constants/icons'
// styling
import { Avatar, Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, FormControl, FormLabel, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Select, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Wrap } from '@chakra-ui/react'
// api
// components
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { FETCH_STORE_PICKUP_DATA } from '@/app/api/pickup/route';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { TERTIARY_BRAND } from '@/components/lib/constants/theme';

function Page() {
    // utils
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    // configs
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;

    // filter options
    const [search_query, set_search_query]=useState('');
    const [show_filter_options,set_show_filter_options] = useState(false);
    const [status_filter,set_status_filter] = useState('none');
    const [from_date,set_from_date] = useState('none');
    const [to_date,set_to_date] = useState('none');
    const [specific_date,set_specific_date] = useState('none');
    const [page,set_page] = useState(1);

    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['store_pickups', {STORE_ID,USER_ID,search_query,status_filter,from_date,to_date,specific_date,page}],
        queryFn: () => FETCH_STORE_PICKUP_DATA(USER_ID,STORE_ID,search_query,status_filter,from_date,to_date,specific_date,page),
        enabled: USER_ID !== undefined && STORE_ID !== undefined
    });
       
    const PICKUPS_DATA = data?.data?.data;
    const PICKUPS_DATA_COUNT = data?.data?.count;

    const Clear_Filters=()=>{
        set_show_filter_options(false)
        set_search_query('');
        set_status_filter('none');
        set_from_date('none');
        set_to_date('none');
        set_specific_date('none');
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
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                {/**
                 * Products tag & management goes here
                 * Search field, New product and product imports
                 */}
                <Text fontWeight='bold' fontSize='32px'>PickUps</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search products'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Link href={`/dashboard/pickups/new?uid=${USER_ID}&store_id=${STORE_ID}`}>
                        <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<ADD_ICON />} >New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/new?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>pickups</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box my='2' boxShadow={'md'} p='2'>
                <Flex align='center' justify={'space-between'}>
                    <IconButton aria-label='filter' icon={show_filter_options? <FILTER_ICON_CLOSE/> : <FILTER_ICON />} size='sm' onClick={(()=>{set_show_filter_options(!show_filter_options)})}/>
                    <Flex gap='4' mx='2'>
                        <Link href={`/dashboard/pickups/new/import?uid=${USER_ID}&store_id=${STORE_ID}`}>
                            <HStack align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                                <Icon as={IMPORT_ICON} boxSize={'4'}/>
                                <Text fontWeight={'bold'} fontSize={'sm'}>import</Text>
                            </HStack>
                        </Link>
                        <HStack align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                            <Icon as={EXPORT_ICON} boxSize={'4'}/>
                            <Text fontWeight={'bold'} fontSize={'sm'}>export</Text>
                        </HStack>
                    </Flex>
                </Flex>
                {show_filter_options && (
                    <Flex spacing='2' my='2' p='2' gap='2' flexDirection={{base:'column',md:'row'}} w={{base:'full',md:''}} align='center'>
                        <FormControl>
                            <FormLabel fontSize={'sm'}>Status</FormLabel>
                            <Select variant='outline' onChange={((e)=>{set_status_filter(e.target.value)})}>
                                <option value='' selected disabled hidden>Status</option>
                                <option value={'collected'}>Collected</option>
                                <option value={'pending'}>Pending</option>
                            </Select>
                        </FormControl>
                        <Flex align='center' gap='2' color='gray.600' flexDirection={{base:'column',md:'row'}} w='full'>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>Select By Day</FormLabel>
                                <Input placeholder='Select Day' size='md' type='date' onChange={((e)=>{set_specific_date(e.target.value)})}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>From Date</FormLabel>
                                <Input placeholder='From Date' size='md' type='date' onChange={((e)=>{set_from_date(e.target.value)})}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>To Date</FormLabel>
                                <Input placeholder='To Date' size='md' type='date' onChange={((e)=>{set_to_date(e.target.value)})}/>
                            </FormControl>
                        </Flex>
                    </Flex>
                )}
                <HStack align='center'>
                    <HStack align='center' spacing='2' color='gray.600'>
                        <Icon as={CHEVRON_LEFT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('-'))}/>
                        <Text fontSize={'xs'}>{page}</Text>
                        <Icon as={CHEVRON_RIGHT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('+'))}/>
                    </HStack>
                    <Text fontSize={'xs'} my='2' color='gray.400' pl='2' borderRight={'1px solid'} borderRightColor={TERTIARY_BRAND}>showing {PICKUPS_DATA?.length || 0}  of {PICKUPS_DATA_COUNT? PICKUPS_DATA_COUNT : 0} items</Text>
                </HStack>
                <Wrap align={'center'}>
                    {status_filter !== 'none' && (<Button fontWeight={''} m='2'  variant='outline' >{status_filter}</Button>)}
                    {from_date !== 'none' || to_date !== 'none' ? (<Button fontWeight={''} m='2'  variant='outline' leftIcon={<CALENDER_ICON/>}>[{moment(from_date).format("DD MMM YY")}] - [{moment(to_date).format("DD MMM YY")}]</Button>) : null}
                    {specific_date !== 'none' ? (<Button fontWeight={''} m='2'  variant='outline' leftIcon={<CALENDER_ICON/>}>{moment(specific_date).format("DD MMM YY")}</Button>) : null}
                    {status_filter !== 'none' || from_date !== 'none' || to_date !== 'none' || specific_date !== 'none' ? <Icon as={CLEAR_FILTER_ICON} boxSize={'5'} color='red' onClick={Clear_Filters} cursor={'pointer'}/>: null}
                </Wrap>
                {PICKUPS_DATA?.length === 0? 
                        <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                            <Icon as={PICKUPS_ICON} boxSize={'6'}/>
                            <Text>No pickups found!.</Text>
                        </Flex>
                    :
                    <TableContainer>
                        {isLoading?
                            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh' w='full'>
                                <Spinner />
                                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store pickups</Text>
                            </Flex>
                        :
                            <Table variant='simple'>
                                <Thead bg='#E4F0FC'>
                                    <Tr>
                                        <Th>Customer</Th>
                                        <Th>Pick Up Date</Th>
                                        <Th>Items</Th>
                                        <Th>Price</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {PICKUPS_DATA?.filter((pickup)=>pickup?.customer_name?.toLowerCase().includes(search_query?.toLowerCase())).reverse()?.map((pickup)=>{
                                        return(
                                            <Tr key={pickup?._id} >
                                                <Td>
                                                    <HStack>
                                                        <Avatar size={'sm'} src='' name={pickup?.customer_name}/>
                                                        <Box>
                                                            <Text>{pickup?.customer_name}</Text>
                                                            <Text fontSize={'12px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{pickup?.customer_mobile}</Text>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Box>
                                                        <Text fontWeight={''}>{moment(pickup?.pickup_date).format("DD MMM YY")}</Text>
                                                        <Text fontSize={'sm'} color='gray.400'>{moment(pickup?.pickup_date).format("h:mm a")}</Text>
                                                    </Box>
                                                </Td>
                                                <Td>
                                                    <Text>
                                                        {pickup?.items}
                                                    </Text>
                                                </Td>
                                                <Td>KES {pickup?.price}</Td>
                                                <Td>
                                                    <Badge 
                                                        fontSize={'sm'}
                                                        colorScheme={pickup?.pickup_status ? 'green':'orange'}
                                                    >
                                                        {pickup?.pickup_stage}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Link href={`/dashboard/pickups/view?uid=${USER_ID}&store_id=${STORE_ID}&pickup_id=${pickup?._id}`}>
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

export default Page;