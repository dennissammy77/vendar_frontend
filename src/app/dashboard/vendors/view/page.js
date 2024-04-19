'use client'
import React, { useContext } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure} from '@chakra-ui/react'
import { MdChevronRight, MdClose, MdDone, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_USER_DATA } from '@/app/api/auth/route';

import { TiUserDelete } from "react-icons/ti";
import DELETE_STAKEHOLDER_ACCOUNT_ALERT from '@/components/ui/user/DELETE_STAKEHOLDER_ACCOUNT_ALERT';
import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();

    const searchParams = useSearchParams();
    const ACCOUNT_ID = searchParams.get('account_id');
    const STORE_ID = searchParams.get('store_id');
    
    const {data, isLoading} = useQuery({
        queryKey: ['account_id', {ACCOUNT_ID}],
        queryFn: () => FETCH_USER_DATA(ACCOUNT_ID)
    });

    const USER_DATA = data?.data?.data;

    console.log(USER_DATA);

    const DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE = useDisclosure()


    return (
        <Box>
            <DELETE_STAKEHOLDER_ACCOUNT_ALERT isOpen={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} USER_DATA={USER_DATA}/>
            <Text fontWeight='bold' fontSize='32px'>Vendor Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/vendors?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>vendors</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{ACCOUNT_ID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
                    <HStack onClick={(()=>{router.push(`/dashboard/vendors/edit?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${ACCOUNT_ID}`)})}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                        <Icon boxSize='6' as={GrFormEdit} cursor='pointer'/>
                    </HStack>
                    <HStack onClick={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onOpen}>
                        <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                        <Icon boxSize='6' as={TiUserDelete} cursor='pointer'/>
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
                            <Text fontWeight={''}>{USER_DATA?.name}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>UserName</Text>
                            <Text fontWeight={''}>{USER_DATA?.username}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Email</Text>
                            <Text fontWeight={''}>{USER_DATA?.email}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Mobile</Text>
                            <Text fontWeight={''}>{USER_DATA?.mobile}</Text>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Store(s)</Text>
                            {USER_DATA?.store_ref?.map((store)=>{
                                return (
                                    <Text fontWeight={''} my='2'>{store?.name}</Text>
                                )
                            })}
                        </Box>
                    </GridItem>
                </Grid>
                {/**
                 * 
                <Grid
                    templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                    templateColumns={{base:'repeat(1, 1fr)',md:'repeat(3, 1fr)'}}
                    gap={4}
                    my='5'
                >
                <GridItem
                    colSpan={2} 
                    bg='#FFFFFF'
                    p='4'
                    borderRadius={20}
                    boxShadow={'md'}
                    fontSize={'12px'}
                    h='300px'
                >
                    <BarChartPlot data={STORE_DATA?.transactions}/>
                </GridItem>
                <GridItem
                colSpan={1}
                >
                <Stat
                    bg='#daf7e9'
                    p='4'
                    borderRadius={20}
                    boxShadow={'sm'}
                    align='center'
                >
                    <StatLabel fontSize='lg'>Vendors</StatLabel>
                    <StatNumber fontSize={'lg'}>{STORE_DATA?.vendors?.length}</StatNumber>
                </Stat>
                <Stat
                    bg='#d3f5f9'
                    p='4'
                    borderRadius={20}
                    boxShadow={'sm'}
                    align='center'
                    my='2'
                >
                    <StatLabel fontSize='lg'>Products</StatLabel>
                    <StatNumber fontSize={'lg'}>{STORE_DATA?.products?.length}</StatNumber>
                </Stat>
                <Stat
                    bg='#Cfc7f1'
                    p='4'
                    borderRadius={20}
                    boxShadow={'sm'}
                    align='center'
                >
                    <StatLabel fontSize='lg'>Transactions</StatLabel>
                    <StatNumber fontSize={'lg'}>{STORE_DATA?.transactions?.length}</StatNumber>
                </Stat>
                </GridItem>
            </Grid>
                 */}
            </Box>
        </Box>
  )
}

export default Page
