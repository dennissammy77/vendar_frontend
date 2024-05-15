'use client'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Spinner} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import { useQuery } from '@tanstack/react-query';
import { FETCH_TRANSACTION_DATA } from '@/app/api/transaction/route';
import UPDATE_TRANSACTION_FORM from '@/components/ui/transaction/UPDATE_TRANSACTION_FORM';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { DISCARD_ICON } from '@/components/lib/constants/icons';

function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    const searchParams = useSearchParams()
    const USER_ID = user?.data?.data?._id;
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const TRANSACTION_ID = searchParams.get('transaction_id');

    const {data, isLoading} = useQuery({
        queryKey: ['transaction_id', {TRANSACTION_ID}],
        queryFn: () => FETCH_TRANSACTION_DATA(TRANSACTION_ID)
    });

    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    const TRANSACTION_DATA = data?.data?.data;

    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Transaction Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/transactions/view?uid=${USER_ID}&store_id=${STORE_ID}&transaction_id=${TRANSACTION_ID}`}>transactions</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{TRANSACTION_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading ?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text>Setting Up transactions details...</Text>
                </Flex> 
                :
                <UPDATE_TRANSACTION_FORM TRANSACTION_DATA={TRANSACTION_DATA} USER_ID={USER_ID}/>
            }
            <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
        </Box>
    )
}

export default Page