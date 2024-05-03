'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FETCH_PICKUP_DATA } from '@/app/api/pickup/route';
import UPDATE_STORE_PICKUP_FORM from '@/components/ui/pickups/UPDATE_STORE_PICKUP_FORM';


function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();

    const USER_ID = user?.data?.data?._id;
    const searchParams = useSearchParams();
    const PICKUP_ID = searchParams.get('pickup_id');
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');

    const {data, isLoading} = useQuery({
        queryKey: ['pickup data', {PICKUP_ID}],
        queryFn: () => FETCH_PICKUP_DATA(PICKUP_ID)
    });

    const PICKUP_DATA = data?.data?.data;

    if (isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh' w='full'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting up pickup details</Text>
            </Flex>
        )
    }
    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Pick Up Data</Text>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/pickups/view/?uid=${USER_ID}&store_id=${STORE_ID}&pickup_id=${PICKUP_ID}`}>PickUp</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{PICKUP_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <UPDATE_STORE_PICKUP_FORM PICKUP_DATA={PICKUP_DATA} USER_ID={USER_ID} PICKUP_ID={PICKUP_ID}/>
            <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>

        </Box>
    )
}

export default Page;