'use client'
import { UserContext } from '@/components/providers/user.context';
import EditStoreForm from '@/components/ui/store/EditStoreForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_STORE_DATA } from '@/app/api/shop/route';
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';

export default  function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    // Handle seaerch parameters
    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;
    
    const {data: store_data, isLoading} = useQuery({
        queryKey: ['store_data', {store_id}],
        queryFn: () => FETCH_STORE_DATA(store_id,USER_ID)
    })
    const data = store_data?.data?.data;
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Edit Store</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/stores?uid=${USER_ID}`}>Stores</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >edit</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        {isLoading ? 
            <Text>Fetching data...</Text>
            :
            <EditStoreForm 
                store_data={data}
            />
        }
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}