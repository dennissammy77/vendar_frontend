'use client'

import React, { useContext } from 'react'
// utils
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
// api
import { FETCH_PICKUP_DATA } from '@/app/api/pickup/route';
// styling
import { Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, Flex, Grid, GridItem, HStack, Icon, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
// component
// icons
import { CHEVRON_RIGHT_ICON, DELETE_ICON, EDIT_ICON, LEFT_ARROW_ICON, MONEY_COINS_ICON, PERSON_ICON, PICKUPS_ICON } from '@/components/lib/constants/icons'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import Link from 'next/link';
import { BASE_BRAND, SECONDARY_BRAND } from '@/components/lib/constants/theme';
import moment from 'moment';
import DELETE_PICKUP_ALERT from '@/components/ui/pickups/DELETE_PICKUP_ALERT';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';

function Page() {
    // util
    const {user} = useContext(UserContext);
    const toast = useToast();
    const router = useRouter()
    // config
    const USER_ID = user?.data?.data?._id;
    const searchParams = useSearchParams();
    const PICKUP_ID = searchParams.get('pickup_id');
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');

    const DELETE_PICKUP_ALERT_DISCLOSURE = useDisclosure();

    const {data, isLoading} = useQuery({
        queryKey: ['pickup data', {PICKUP_ID}],
        queryFn: () => FETCH_PICKUP_DATA(PICKUP_ID)
    });
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }
    if (isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh' w='full'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching pickup data</Text>
            </Flex>
        )
    }

    const PICKUP_DATA = data?.data?.data;

    return (
        <Box>
            <DELETE_PICKUP_ALERT isOpen={DELETE_PICKUP_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_PICKUP_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} PICKUP_ID={PICKUP_ID}/>
            <Text fontWeight='bold' fontSize='32px'>PickUp Data</Text>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='4'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/pickups?uid=${USER_ID}&store_id=${STORE_ID}`}>PickUp</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{PICKUP_DATA?.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
                    <Link href={`/dashboard/pickups/edit?uid=${USER_ID}&store_id=${STORE_ID}&pickup_id=${PICKUP_ID}`}>
                        <HStack>
                            <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                            <Icon boxSize='6' as={EDIT_ICON} cursor='pointer'/>
                        </HStack>
                    </Link>
                    <HStack onClick={DELETE_PICKUP_ALERT_DISCLOSURE?.onOpen}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                        <Icon boxSize='6' as={DELETE_ICON} cursor='pointer'/>
                    </HStack>
                </Flex>
            </Box>
            <Grid templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}} templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}} gap={4} my='2' >
                <GridItem boxShadow={'md'} p='2' bg={BASE_BRAND} borderRadius={'md'}>
                    <Box>
                        <Text fontWeight={'bold'}>Name</Text>
                        <Text fontWeight={''}>{PICKUP_DATA?.name}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Price</Text>
                        <Text fontWeight={''}>{PICKUP_DATA?.price}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Items</Text>
                        <Text fontWeight={''}>{PICKUP_DATA?.price}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Code</Text>
                        <Text fontWeight={''}>{PICKUP_DATA?.code}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Comment</Text>
                        <Text fontWeight={''}>{PICKUP_DATA?.comment}</Text>
                    </Box>
                    <HStack align='center' my='2'>
                        <Icon as={PICKUPS_ICON} boxSize={'4'} />
                        <Text fontWeight={'bold'}>Pick Up Details</Text>
                    </HStack>
                    <Divider/>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Date</Text>
                        <Text fontWeight={''}>{moment(PICKUP_DATA?.pickup_date).format("DD MMM YY")}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight={'bold'}>Status</Text>
                        <Badge colorScheme={PICKUP_DATA?.pickup_status?.pickup_status? 'green': 'orange'}>{PICKUP_DATA?.pickup_status?.pickup_stage}</Badge>
                    </Box>
                </GridItem>
                <GridItem boxShadow={'md'} p='2' bg={BASE_BRAND} borderRadius={'md'}>
                    <HStack align='center' my='2'>
                        <Icon as={PERSON_ICON} boxSize={'4'} />
                        <Text fontWeight={'bold'}>Customer Details</Text>
                    </HStack>
                    <Divider/>
                    <Box>
                        <Text fontWeight={'bold'}>Name</Text>
                        <Text >{PICKUP_DATA?.customer_name}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Mobile</Text>
                        <Text fontWeight={''} my='2'>{PICKUP_DATA?.customer_mobile}</Text>
                    </Box>
                    <HStack align='center' my='2'>
                        <Icon as={MONEY_COINS_ICON} boxSize={'4'} />
                        <Text fontWeight={'bold'}>Payment Details</Text>
                    </HStack>
                    <Divider/>
                    <Box>
                        <Text fontWeight={'bold'}>Status</Text>
                        <Badge colorScheme={PICKUP_DATA?.payment_status? 'green': 'orange'}>{PICKUP_DATA?.payment_status? 'paid': 'pending'}</Badge>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Method</Text>
                        <Text fontWeight={''} my='2'>{PICKUP_DATA?.payment_method}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Code</Text>
                        <Text fontWeight={''} my='2'>{PICKUP_DATA?.payment_code}</Text>
                    </Box>
                    <HStack align='center' my='2'>
                        <Icon as={PERSON_ICON} boxSize={'4'} />
                        <Text fontWeight={'bold'}>Vendor Details</Text>
                    </HStack>
                    <Divider/>
                    <Box>
                        <Text fontWeight={'bold'}>Name</Text>
                        <Text>{PICKUP_DATA?.on_the_go_client_name}</Text>
                    </Box>
                    <Box my='2'>
                        <Text fontWeight={'bold'}>Mobile</Text>
                        <Text fontWeight={''} my='2'>{PICKUP_DATA?.on_the_go_client_mobile}</Text>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Page