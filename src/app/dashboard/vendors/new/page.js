'use client'
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { UserContext } from '@/components/providers/user.context';
import { NEW_VENDOR_FORM } from '@/components/ui/staff/NewStaffForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  const searchParams = useSearchParams();
  const USER_ID = user?.data?.data?._id;
  const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Vendor</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/vendors?uid=${USER_ID}&store_id=${STORE_ID}`}>Vendors</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NEW_VENDOR_FORM />
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}

export default Page