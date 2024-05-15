'use client'
import React, { useContext, useState } from 'react';

// utils
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
// styling
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge } from '@chakra-ui/react'
// icons
import { ADD_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, MANAGE_ICON, PEOPLE_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import Link from 'next/link';
import { PRIMARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';

export default function Page() {
    // Utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    // filter options
    const [search_query, set_search_query]=useState('');
    const [page,set_page] = useState(1);

    // configs
    const USER_ID = user?.data?.data?._id;
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const ACCOUNT_TYPE = 'store_admin';
    // Functions

    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID,page,search_query}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE,page,search_query)
    });

    const STAFF_DATA = data?.data?.data;
    const STAFF_COUNT = data?.data?.count;

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
                <Text fontWeight='bold' fontSize='32px'>Staff</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search staff'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Link href={`/dashboard/staff/new?uid=${USER_ID}&store_id=${STORE_ID}`}>
                        <Button bgColor={PRIMARY_BRAND} color='#ffffff' leftIcon={<ADD_ICON />}>New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Staff</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <HStack align='center'>
                <HStack align='center' spacing='2' color='gray.600'>
                    <Icon as={CHEVRON_LEFT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('-'))}/>
                    <Text fontSize={'xs'}>{page}</Text>
                    <Icon as={CHEVRON_RIGHT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('+'))}/>
                </HStack>
                <Text fontSize={'xs'} my='2' color='gray.400' pl='2' borderRight={'1px solid'} borderRightColor={TERTIARY_BRAND}>showing {STAFF_DATA?.length || 0}  of {STAFF_COUNT? STAFF_COUNT : 0} items</Text>
            </HStack>
            {STAFF_DATA?.length === 0? 
                    <Flex border='1px solid' borderColor={TERTIARY_BRAND} borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                        <Icon as={PEOPLE_ICON} boxSize={'6'}/>
                        <Text>No staff found!.</Text>
                    </Flex>
                :
                <TableContainer boxShadow={'md'}>
                    {isLoading?
                        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                            <Spinner />
                            <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching staff</Text>
                        </Flex>
                        :
                        <Table variant='simple'>
                            <Thead bg={TERTIARY_BRAND}>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Phone</Th>
                                    <Th>Role</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {STAFF_DATA?.map((staff)=>{
                                    return(
                                        <Tr key={staff?._id} >
                                            <Td>
                                                <HStack>
                                                    <Avatar size={'sm'} src='' name={staff?.name}/>
                                                    <Box>
                                                        <Text>{staff?.name}</Text>
                                                        <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{staff?.email}</Text>
                                                    </Box>
                                                </HStack>
                                            </Td>
                                            <Td>{staff?.mobile}</Td>
                                            <Td>{staff?.store_admin_account_ref?.role}</Td>
                                            <Td><Badge colorScheme={staff?.account_status_ref?.suspension_status ? 'orange':'green'}>{staff?.account_status_ref?.suspension_status ? 'suspended' : 'active'}</Badge></Td>
                                            <Td>
                                                {staff?.store_admin_account_ref.role === 'owner'? 
                                                    null
                                                    :
                                                    <Link href={`/dashboard/staff/view?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${staff?._id}`}>
                                                        <HStack color='gray.600' cursor={'pointer'}pr='1'>
                                                            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                                            <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
                                                        </HStack>
                                                    </Link>
                                                }
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
    )
};