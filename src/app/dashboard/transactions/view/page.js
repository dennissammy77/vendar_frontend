'use client'
import React, { useContext } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, Divider, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure} from '@chakra-ui/react'
import { MdChevronRight, MdOutlineDeleteOutline } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { FETCH_TRANSACTION_DATA } from '@/app/api/transaction/route';
import DELETE_TRANSACTION_ALERT from '@/components/ui/transaction/DELETE_TRANSACTION_ALERT';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();

    const searchParams = useSearchParams();
    const TRANSACTION_ID = searchParams.get('transaction_id');
    const STORE_ID = searchParams.get('store_id');
    
    const {data, isLoading} = useQuery({
        queryKey: ['transaction_id', {TRANSACTION_ID}],
        queryFn: () => FETCH_TRANSACTION_DATA(TRANSACTION_ID)
    });

    const TRANSACTION_DATA = data?.data?.data;
    console.log(TRANSACTION_DATA)

    const DELETE_TRANSACTION_ALERT_DISCLOSURE = useDisclosure()

    return (
        <Box>
            <DELETE_TRANSACTION_ALERT isOpen={DELETE_TRANSACTION_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_TRANSACTION_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} TRANSACTION_ID={TRANSACTION_ID} STORE_ID={STORE_ID}/>
            <Text fontWeight='bold' fontSize='32px'>Transaction Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/transactions?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>transactions</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>-</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'} boxShadow={'md'} my='2' p='4' borderRadius={'sm'}>
                    <HStack onClick={(()=>{router.push(`/dashboard/transactions/edit?uid=${USER_ID}&store_id=${STORE_ID}&transaction_id=${TRANSACTION_ID}`)})}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                        <Icon boxSize='6' as={GrFormEdit} cursor='pointer'/>
                    </HStack>
                    <HStack onClick={DELETE_TRANSACTION_ALERT_DISCLOSURE?.onOpen}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                        <Icon boxSize='6' as={MdOutlineDeleteOutline} cursor='pointer'/>
                    </HStack>
                </Flex>
                <Grid
                    templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                    templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
                    gap={4}
                    my='2'
                >
                    <GridItem boxShadow={'md'} my='2' p='4' borderRadius={'md'}>
                        <Flex align='center' justify={'space-between'} my='2'>
                            <Text fontWeight={'bold'}>Transaction Details</Text>
                            <Badge colorScheme={TRANSACTION_DATA?.payment? 'green':'orange'}>{TRANSACTION_DATA?.status}</Badge>
                        </Flex>
                        <Divider/>
                        <Flex justify={'space-between'}>
                            <Box my='2'>
                                <Text fontWeight={'bold'} fontSize={'xl'}>SubTotal</Text>
                                <Text fontWeight={''}>KES {TRANSACTION_DATA?.price}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={''}>Items</Text>
                                <Text fontWeight={''}>{TRANSACTION_DATA?.items}</Text>
                            </Box>
                        </Flex>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Delivery Details</Text>
                            <Divider/>
                        </Box>
                        <HStack my='2'>
                            <Text>Fee: </Text>
                            <Text>KES {TRANSACTION_DATA?.delivery_fee}</Text>
                        </HStack>
                        <HStack my='2'>
                            <Text>Rider: </Text>
                            <Text>{TRANSACTION_DATA?.delivery_person_name}</Text>
                        </HStack>
                        <HStack my='2'>
                            <Text>contact: </Text>
                            <Text>{TRANSACTION_DATA?.delivery_person_contact}</Text>
                        </HStack>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Payment Details</Text>
                            <Text fontWeight={''} my='1'>{TRANSACTION_DATA?.payment_method}</Text>
                            <Text fontWeight={''} my='1'>{TRANSACTION_DATA?.payment_code}</Text>
                        </Box>
                        <Divider/>
                        <Box my='2'>
                            <Text fontWeight={'bold'} fontSize='xl'>Total</Text>
                            <Text fontWeight={''}>KES {TRANSACTION_DATA?.payment_total}</Text>
                        </Box>
                    </GridItem>
                    <GridItem boxShadow={'md'} my='2' p='4' borderRadius={'md'}>
                        <Text fontWeight={'bold'} fontSize={'lg'}>Product Details</Text>
                        <Divider/>
                        <Flex justify='space-between'>
                            <Box>
                                <Text fontWeight={'bold'}>Name</Text>
                                <Text fontWeight={''}>{TRANSACTION_DATA?.product_ref?.name}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Price</Text>
                                <Text fontWeight={''}>{TRANSACTION_DATA?.product_ref?.price}</Text>
                            </Box>
                        </Flex>
                        <Text fontWeight={'bold'} fontSize={'lg'} my='2'>Store Details</Text>
                        <Divider/>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.store_ref?.name}</Text>
                        </Box>
                        <Text fontWeight={'bold'} fontSize={'lg'} my='2'>Vendor Details</Text>
                        <Divider/>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.vendor?.name}</Text>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
            <Box>
                
            </Box>
        </Box>
  )
}

export default Page