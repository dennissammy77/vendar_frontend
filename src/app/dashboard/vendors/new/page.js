'use client'
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

  const searchParams = useSearchParams()
  const store_id = searchParams.get('store_id');
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Vendor</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/vendors?uid=${user?.data?.data?._id}&store_id=${store_id}`}>Vendors</BreadcrumbLink>
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