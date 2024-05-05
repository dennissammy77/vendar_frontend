'use client'
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { UserContext } from '@/components/providers/user.context';
import NEW_STORE_PICKUP_FORM from '@/components/ui/pickups/NEW_STORE_PICKUP_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  const searchParams = useSearchParams()
  const store_id = searchParams.get('store_id');
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New PickUp</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/pickups?uid=${user?.data?.data?._id}&store_id=${store_id}`}>PickUps</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NEW_STORE_PICKUP_FORM />
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}

export default Page