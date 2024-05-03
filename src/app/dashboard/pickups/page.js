'use client'

import React, { useContext, useState } from 'react'
// utils
import { UserContext } from '@/components/providers/user.context';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

// icons
import { ADD_ICON, CHEVRON_RIGHT_ICON, MANAGE_ICON, PICKUPS_ICON, SEARCH_ICON } from '@/components/lib/constants/icons'
// styling
import { Avatar, Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
// api
// components
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { FETCH_STORE_PICKUP_DATA } from '@/app/api/pickup/route';

function Page() {
    // utils
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    // configs
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;

    // filter options
    const [search_query, set_search_query]=useState('');

    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['store_pickups', {STORE_ID,USER_ID}],
        queryFn: () => FETCH_STORE_PICKUP_DATA(USER_ID,STORE_ID),
        enabled: USER_ID !== undefined && STORE_ID !== undefined
    });
    
    const PICKUPS_DATA = data?.data?.data;

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>Error occured fetching pickups data</Text>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>{data?.data?.message}</Text>
            </Flex>
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
                    <Link href={`/dashboard/pickups/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>
                        <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<ADD_ICON />} >New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>pickups</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box my='2' boxShadow={'md'}>
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
                                        <Th>Name</Th>
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
                                                        colorScheme={pickup?.pickup_status?.pickup_status ? 'green':'orange'}
                                                    >
                                                        {pickup?.pickup_status?.pickup_stage}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Link href={`/dashboard/pickups/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&pickup_id=${pickup?._id}`}>
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