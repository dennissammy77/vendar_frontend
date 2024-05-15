'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { UserContext } from '@/components/providers/user.context';
import NEW_STORE_PRODUCT_FORM from '@/components/ui/product/NEW_STORE_PRODUCT_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { VscDiscard } from 'react-icons/vsc';

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);
  const searchParams = useSearchParams()

  const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
  const USER_ID = user?.data?.data?._id;
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Product</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/products?uid=${USER_ID}&store_id=${STORE_ID}`}>Product</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NEW_STORE_PRODUCT_FORM />
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}

export default Page