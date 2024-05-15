'use client'
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { UserContext } from '@/components/providers/user.context'
import NewStoreForm from '@/components/ui/store/NewStoreForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;

    const router = useRouter();
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Store</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/stores?uid=${USER_ID}`}>Stores</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NewStoreForm/>
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}

export default Page