'use client'
import React, { useContext } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure, Spinner} from '@chakra-ui/react'
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_USER_DATA } from '@/app/api/auth/route';

import DELETE_STAKEHOLDER_ACCOUNT_ALERT from '@/components/ui/user/DELETE_STAKEHOLDER_ACCOUNT_ALERT';
import { CHEVRON_RIGHT_ICON, CLOSE_ICON, DONE_ICON, EDIT_ICON, USER_DELETE_ICON } from '@/components/lib/constants/icons';
import Link from 'next/link';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();

    const searchParams = useSearchParams();
    const ACCOUNT_ID = searchParams.get('account_id');
    const STORE_ID = searchParams.get('store_id');
    
    const {data, isLoading} = useQuery({
        queryKey: ['account_id', {ACCOUNT_ID}],
        queryFn: () => FETCH_USER_DATA(ACCOUNT_ID)
    });

    const USER_DATA = data?.data?.data;
    const DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE = useDisclosure()


    if(isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching user data</Text>
            </Flex>
        )
    }

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.300' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }


    return (
        <Box>
            <DELETE_STAKEHOLDER_ACCOUNT_ALERT isOpen={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} USER_DATA={USER_DATA}/>
            <Text fontWeight='bold' fontSize='32px'>Staff Data</Text>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/staff?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>staff</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{ACCOUNT_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
                    <Link href={`/dashboard/staff/edit?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${ACCOUNT_ID}`}>
                        <HStack>
                            <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                            <Icon boxSize='6' as={EDIT_ICON} cursor='pointer'/>
                        </HStack>
                    </Link>
                    <HStack onClick={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onOpen}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                        <Icon boxSize='6' as={USER_DELETE_ICON} cursor='pointer'/>
                    </HStack>
                </Flex>
                <Grid
                    templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                    templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
                    gap={4}
                    my='2'
                >
                    <GridItem>
                        <Box>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{USER_DATA?.name}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>UserName</Text>
                            <Text fontWeight={''}>{USER_DATA?.username}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Email</Text>
                            <Text fontWeight={''}>{USER_DATA?.email}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Mobile</Text>
                            <Text fontWeight={''}>{USER_DATA?.mobile}</Text>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box>
                            <Text fontWeight={'bold'}>Current role</Text>
                            <Badge fontSize="xs" color="#ffffff" bg='#4E2FD7' >{USER_DATA?.store_admin_account_ref?.role}</Badge>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Store(s)</Text>
                            {USER_DATA?.store_ref?.map((store)=>{
                                return (
                                    <Text fontWeight={''} my='2'>{store?.name}</Text>
                                )
                            })}
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
            <Box p='4' boxShadow={'md'} borderRadius={'md'}>
                <Text fontWeight={'bold'} my='2'>Permissions</Text>
                <TableContainer>
                    <Table size='md'>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>VIEW</Th>
                                <Th>CREATE</Th>
                                <Th>EDIT</Th>
                                <Th>DELETE</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Store</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Staff</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Vendor</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Product</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Customer</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Transcations</Td>
                                <Td><Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={DONE_ICON} boxSize={'5'} color={'gray.400'}/> : <Icon as={CLOSE_ICON} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
  )
}

export default Page