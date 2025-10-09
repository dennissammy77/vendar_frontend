'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge, IconButton, useToast } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_ALL_STAKEHOLDERS_DATA_FOR_EXPORT, FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { ADD_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, EXPORT_ICON, FILTER_ICON, FILTER_ICON_CLOSE, IMPORT_ICON, MANAGE_ICON, PEOPLE_ICON, PERSON_ADD_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';
import { PRIMARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import Link from 'next/link';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { EXPORT_VENDORS_EXCEL } from '@/components/hooks/export/EXCEL';


export default function Page() {
    // Utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const searchParams = useSearchParams();
    //filter options
    const [search_query, set_search_query]=useState('');
    const [page,set_page] = useState(1);

    // config 
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;
    const ACCOUNT_TYPE = 'vendor';

    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID,page,search_query}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE,page,search_query)
    });

    const VENDORS_DATA = data?.data?.data;
    const VENDORS_COUNT = data?.data?.count;


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

    const HANDLE_EXPORT_DATA = async()=>{
        const ALL_VENDORS = await FETCH_ALL_STAKEHOLDERS_DATA_FOR_EXPORT (STORE_ID,ACCOUNT_TYPE,USER_ID);
        toast({ title: 'Exporting Vendors Data', description: `Please wait`, status: 'loading', variant: 'left-accent', position:'top-left',isClosable: true, duration: 1000 });
        await EXPORT_VENDORS_EXCEL(ALL_VENDORS?.data?.data)
        .then(()=>{
            toast({ title: 'Success!', description: `Vendors exported successfully`, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            return;
        }).catch((err)=>{
            toast({ title: `${err}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
            throw new Error('Error')
        })
    }

    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Vendors</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search vendors'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Link href={`/dashboard/vendors/new?uid=${USER_ID}&store_id=${STORE_ID}`}>
                        <Button bgColor={PRIMARY_BRAND} color='#ffffff' leftIcon={<ADD_ICON />}>New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Vendors</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box my='2' boxShadow={'md'} p='2'>
                <Flex align='center' justify={'flex-end'}>
                    <Flex gap='4' mx='2'>
                        <Link href={`/dashboard/vendors/requests?uid=${USER_ID}&store_id=${STORE_ID}`}>
                            <HStack align='center' _hover={{bg:'gray.100'}} p='2' borderRadius={'5'} transition={'.3s ease-out'}>
                                <Icon as={PERSON_ADD_ICON} boxSize={'4'}/>
                                <Text fontWeight={'bold'} fontSize={'sm'}>requests</Text>
                            </HStack>
                        </Link>
                        <Link href={`/dashboard/vendors/new/import?uid=${USER_ID}&store_id=${STORE_ID}`}>
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
            </Box>
            <HStack align='center'>
                <HStack align='center' spacing='2' color='gray.600'>
                    <Icon as={CHEVRON_LEFT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('-'))}/>
                    <Text fontSize={'xs'}>{page}</Text>
                    <Icon as={CHEVRON_RIGHT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('+'))}/>
                </HStack>
                <Text fontSize={'xs'} my='2' color='gray.400' pl='2' borderRight={'1px solid'} borderRightColor={TERTIARY_BRAND}>showing {VENDORS_DATA?.length || 0}  of {VENDORS_COUNT? VENDORS_COUNT : 0} items</Text>
            </HStack>
            {VENDORS_DATA?.length === 0? 
                    <Flex border='1px solid' borderColor={TERTIARY_BRAND} borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                        <Icon as={PEOPLE_ICON} boxSize={'6'}/>
                        <Text>No vendors found!.</Text>
                    </Flex>
                :
                <TableContainer boxShadow={'md'}>
                    {isLoading?
                        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                            <Spinner />
                            <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching vendors</Text>
                        </Flex>
                        :
                        <Table variant='simple'>
                            <Thead bg={TERTIARY_BRAND}>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Phone</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {VENDORS_DATA?.map((vendor)=>{
                                    return(
                                        <Tr key={vendor?._id} >
                                            <Td>
                                                <HStack>
                                                    <Avatar size={'sm'} src='' name={vendor?.name}/>
                                                    <Box>
                                                        <Text>{vendor?.name}</Text>
                                                        <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{vendor?.email}</Text>
                                                    </Box>
                                                </HStack>
                                            </Td>
                                            <Td>{vendor?.email}</Td>
                                            <Td>{vendor?.mobile}</Td><Td>
                                                <Link href={`/dashboard/vendors/view?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${vendor?._id}`}>
                                                    <HStack color='gray.600' cursor={'pointer'}pr='1'>
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
    )
}