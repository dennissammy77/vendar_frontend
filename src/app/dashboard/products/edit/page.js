'use client'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Spinner} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import { useQuery } from '@tanstack/react-query';
import { FETCH_PRODUCT_DATA } from '@/app/api/product/route';
import UPDATE_STORE_PRODUCT_FORM from '@/components/ui/product/UPDATE_STORE_PRODUCT_FORM';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';

function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
    const searchParams = useSearchParams()
    const USER_ID = searchParams.get('uid');
    const PRODUCT_ID = searchParams.get('product_id');
    const STORE_ID = searchParams.get('store_id');
    
    const {data, isLoading} = useQuery({
        queryKey: ['product data', {PRODUCT_ID}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });

    const PRODUCT_DATA = data?.data?.data;
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Product Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products/view/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Product</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{PRODUCT_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading ?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text>Setting Up PRODUCT details...</Text>
                </Flex> 
                :
                <UPDATE_STORE_PRODUCT_FORM PRODUCT_DATA={PRODUCT_DATA} STORE_ID={STORE_ID} USER_ID={USER_ID}/>
            }
            <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
        </Box>
    )
}

export default Page