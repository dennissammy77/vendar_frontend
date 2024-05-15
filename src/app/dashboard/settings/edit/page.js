'use client'
import { UserContext } from '@/components/providers/user.context';
import UPDATE_USER_FORM from '@/components/ui/user/UPDATE_USER_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Spinner} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import { useQuery } from '@tanstack/react-query';
import { FETCH_USER_DATA } from '@/app/api/auth/route';
import { DISCARD_ICON } from '@/components/lib/constants/icons';

function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    const searchParams = useSearchParams()
    const USER_ID = searchParams.get('uid');

    const {data: USER_DATA, isLoading} = useQuery({
        queryKey: ['USER_DATA', {USER_ID}],
        queryFn: () => FETCH_USER_DATA(USER_ID)
    })
    const data = USER_DATA?.data?.data;
    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Personal Settings</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} mb='4'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/settings?uid=${USER_ID}`}>settings</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>edit</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading ?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text>Setting Up your profile...</Text>
                </Flex> 
                :
                <UPDATE_USER_FORM USER_DATA={data}/>
            }
            <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
        </Box>
    )
}

export default Page