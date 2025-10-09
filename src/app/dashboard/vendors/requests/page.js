'use client'
import { Box, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, useToast } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import React, { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_VENDOR_REQUEST_STAKEHOLDER_DETAILS, MANAGE_STORE_VENDOR_REQUESTS } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { CHEVRON_RIGHT_ICON, CLOSE_ICON, DONE_ICON, PEOPLE_ICON } from '@/components/lib/constants/icons';
import { TERTIARY_BRAND } from '@/components/lib/constants/theme';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';


export default function Page() {
    // Utils
    const {user} = useContext(UserContext);
    const toast = useToast();
    const searchParams = useSearchParams();
    //filter options

    // config 
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;

    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID}],
        queryFn: () => FETCH_VENDOR_REQUEST_STAKEHOLDER_DETAILS(USER_ID,STORE_ID)
    });

    const HANDLE_MANAGE_VENDOR_REQUEST=async(ACCOUNT_ID,FLAG)=>{
        try{
            await MANAGE_STORE_VENDOR_REQUESTS (USER_ID,STORE_ID,ACCOUNT_ID,FLAG).then((response)=>{
                if(response?.data?.error === true){
                    return toast({ title: `Error!:${response?.data?.message}`,description: ``, status: 'warning', variant: 'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: `Success!:${response?.data?.message}`, description: ``, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            });
        }catch(error){
            return toast({ title: `${error}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
		}
    }

    const VENDORS_DATA = data?.data?.data;
    
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Vendors</Text>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem href={`/dashboard/vendors?uid=${USER_ID}&store_id=${STORE_ID}`}>
                    <BreadcrumbLink fontSize={'sm'}>Vendors</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Requests</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {VENDORS_DATA?.length === 0? 
                    <Flex border='1px solid' borderColor={TERTIARY_BRAND} borderRadius={'md'} boxShadow={'sm'} p='10' h='60vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                        <Icon as={PEOPLE_ICON} boxSize={'6'}/>
                        <Text>No vendor requests found!.</Text>
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
                                            <Td>{vendor?.mobile}</Td>
                                            <Td>
                                                <Box>
                                                    <HStack color='gray.600' cursor={'pointer'} pr='1' my='1' colorScheme='green' onClick={(()=>{HANDLE_MANAGE_VENDOR_REQUEST(vendor?._id,'approve')})}>
                                                        <Text fontSize={'xs'} fontWeight={'bold'}>approve</Text>
                                                        <Icon boxSize='4' as={DONE_ICON } cursor='pointer'/>
                                                    </HStack>
                                                    <Divider/>
                                                    <HStack color='gray.600' cursor={'pointer'} pr='1' my='1' colorScheme='orange' onClick={(()=>{HANDLE_MANAGE_VENDOR_REQUEST(vendor?._id,'reject')})}>
                                                        <Text fontSize={'xs'} fontWeight={'bold'}>reject</Text>
                                                        <Icon boxSize='4' as={CLOSE_ICON } cursor='pointer'/>
                                                    </HStack>
                                                </Box>
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