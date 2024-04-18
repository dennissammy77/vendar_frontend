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
                    <BreadcrumbLink isCurrentPage>{TRANSACTION_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
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
                    <GridItem>
                        <Flex align='center' justify={'space-between'}>
                            <Text fontWeight={'bold'}>Transaction Details</Text>
                            <Badge colorScheme={TRANSACTION_DATA?.payment? 'green':'orange'}>{TRANSACTION_DATA?.status}</Badge>
                        </Flex>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>SubTotal</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.price}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Items</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.items}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Delivery</Text>
                            <Text fontWeight={''}>KES{TRANSACTION_DATA?.delivery_fee}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Payment Details</Text>
                            <Text fontWeight={''} my='1'>{TRANSACTION_DATA?.payment_method}</Text>
                            <Text fontWeight={''} my='1'>{TRANSACTION_DATA?.payment_code}</Text>
                        </Box>
                        <Divider/>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Total</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.payment_total}</Text>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight={'bold'} fontSize={'lg'}>Product Details</Text>
                        <Box>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.product_ref?.name}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Price</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.product_ref?.price}</Text>
                        </Box>
                        <Text fontWeight={'bold'} fontSize={'lg'} my='2'>Store Details</Text>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{TRANSACTION_DATA?.store_ref?.name}</Text>
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