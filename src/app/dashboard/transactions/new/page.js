'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { UserContext } from '@/components/providers/user.context';
import NEW_TRANSACTION_FORM from '@/components/ui/transaction/NEW_TRANSACTION_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react';

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  const searchParams = useSearchParams()
  const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
  const USER_ID = user?.data?.data?._id;

  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Transaction</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/transactions?uid=${USER_ID}&store_id=${STORE_ID}`}>transactions</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NEW_TRANSACTION_FORM />
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}

export default Page