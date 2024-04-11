'use client'
import React, { useContext } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, Spinner, HStack, useDisclosure} from '@chakra-ui/react'
import { MdChevronRight, MdOutlineDeleteOutline } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_PRODUCT_DATA } from '@/app/api/product/route';
import DELETE_PRODUCT_ALERT from '@/components/ui/product/DELETE_PRODUCT_ALERT';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();

    const searchParams = useSearchParams();
    const PRODUCT_ID = searchParams.get('product_id');
    const STORE_ID = searchParams.get('store_id');
    
    const {data, isLoading} = useQuery({
        queryKey: ['product data', {PRODUCT_ID}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });

    const PRODUCT_DATA = data?.data?.data;

    const DELETE_PRODUCT_ALERT_DISCLOSURE = useDisclosure()

    return (
        <Box>
            <DELETE_PRODUCT_ALERT isOpen={DELETE_PRODUCT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_PRODUCT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} PRODUCT_ID={PRODUCT_ID}/>
            <Text fontWeight='bold' fontSize='32px'>Product Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>Products</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{PRODUCT_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching product details</Text>
                </Flex>
                :
                <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                    <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
                        <HStack onClick={(()=>{router.push(`/dashboard/products/edit?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`)})}>
                            <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                            <Icon boxSize='6' as={GrFormEdit} cursor='pointer'/>
                        </HStack>
                        <HStack onClick={DELETE_PRODUCT_ALERT_DISCLOSURE?.onOpen}>
                            <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                            <Icon boxSize='6' as={MdOutlineDeleteOutline} cursor='pointer'/>
                        </HStack>
                    </Flex>
                    <Grid
                        templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                        templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
                        gap={4}
                        my='2'
                    >
                        <GridItem>
                            <Box>
                                <Text fontWeight={'bold'}>Name</Text>
                                <Text fontWeight={''}>{PRODUCT_DATA?.name}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Price</Text>
                                <Text fontWeight={''}>{PRODUCT_DATA?.price}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Category</Text>
                                <Text fontWeight={''}>{PRODUCT_DATA?.category}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Items</Text>
                                <Text fontWeight={''}>{PRODUCT_DATA?.items}</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box>
                                <Text fontWeight={'bold'}>Discount</Text>
                                <Text fontSize="xs" >{PRODUCT_DATA?.discount? PRODUCT_DATA?.discountprice: '-'}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Store</Text>
                                <Text fontWeight={''} my='2'>{PRODUCT_DATA?.store_ref?.name}</Text>
                            </Box>
                            <Box my='2'>
                                <Text fontWeight={'bold'}>Listed By</Text>
                                <Text fontWeight={''} my='2'>{PRODUCT_DATA?.owner_ref_id?.name}</Text>
                            </Box>
                        </GridItem>
                    </Grid>
                    <Text fontWeight={'bold'} my='2'>Description</Text>
                    <Text>{PRODUCT_DATA?.description}</Text>
                </Box>
            }
        </Box>
  )
}

export default Page