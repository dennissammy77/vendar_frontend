'use client'
import { UserContext } from '@/components/providers/user.context';
import { UPDATE_STORE_STAKEHOLDER_FORM } from '@/components/ui/user/UPDATE_USER_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Spinner} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import { useQuery } from '@tanstack/react-query';
import { FETCH_USER_DATA } from '@/app/api/auth/route';

function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    const searchParams = useSearchParams()
    const USER_ID = searchParams.get('uid');
    const ACCOUNT_ID = searchParams.get('account_id');
    const STORE_ID = searchParams.get('store_id');


    const {data, isLoading} = useQuery({
        queryKey: ['account_id', {ACCOUNT_ID}],
        queryFn: () => FETCH_USER_DATA(ACCOUNT_ID)
    });

    const USER_DATA = data?.data?.data;

    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Staff Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/staff/view/?uid=${USER_ID}&account_id=${ACCOUNT_ID}`}>staff</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{ACCOUNT_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading ?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text>Setting Up account profile...</Text>
                </Flex> 
                :
                <UPDATE_STORE_STAKEHOLDER_FORM USER_DATA={USER_DATA} STORE_ID={STORE_ID} USER_ID={USER_ID}/>
            }
            <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
        </Box>
    )
}

export default Page