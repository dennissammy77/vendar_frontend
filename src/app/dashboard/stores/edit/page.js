'use client'
import { UserContext } from '@/components/providers/user.context';
import EditStoreForm from '@/components/ui/store/EditStoreForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';
import { useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FetchStore } from '@/app/api/shop/route';

export default  function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    // Handle seaerch parameters
    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');
    
    const {data: store_data, isLoading} = useQuery({
        queryKey: ['store_data', {store_id}],
        queryFn: () => FetchStore(store_id)
    })
    const data = store_data?.data?.data;
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Edit Store</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/stores/?uid=${user?.data?.data?._id}`}>Stores</BreadcrumbLink>
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
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.push(`/dashboard/stores/?uid=${user?.data?.data?._id}`)})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}