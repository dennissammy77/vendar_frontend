'use client'
import React, { useContext, useState } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure, Tabs, TabList, Tab, Divider, TabPanels, TabPanel, Avatar, Progress} from '@chakra-ui/react'
import { MdChevronRight, MdClose, MdDone, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_USER_DATA } from '@/app/api/auth/route';

import { TiUserDelete } from "react-icons/ti";
import DELETE_STAKEHOLDER_ACCOUNT_ALERT from '@/components/ui/user/DELETE_STAKEHOLDER_ACCOUNT_ALERT';
import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
import moment from 'moment';
import { IoMdSettings } from 'react-icons/io';

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
    const PRODUCTS_DATA = USER_DATA?.store_ref[0]?.products;
    const TRANSACTIONS_DATA = USER_DATA?.store_ref[0]?.transactions;

    console.log(USER_DATA);
    console.log(PRODUCTS_DATA);
    console.log(TRANSACTIONS_DATA);

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
                    <BreadcrumbLink isCurrentPage>{USER_DATA?.username || USER_DATA?.name}</BreadcrumbLink>
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
            </Box>
            <Tabs variant='soft-rounded' colorScheme='blue' isLazy my='4'>
                <TabList my='2'>
                    <Tab>Products</Tab>
                    <Tab>Transactions</Tab>
                    <Tab>Data</Tab>
                </TabList>
                <Divider/>
                <TabPanels>
                    <TabPanel>
                        <Products_Section PRODUCTS_DATA={PRODUCTS_DATA} USER_DATA={USER_DATA}/>
                    </TabPanel>
                    <TabPanel>
                        <Transaction_Section TRANSACTIONS_DATA={TRANSACTIONS_DATA} USER_DATA={USER_DATA}/>
                    </TabPanel>
                    <TabPanel>
                        <Box
                            bg='#FFFFFF'
                            p='4'
                            borderRadius={20}
                            boxShadow={'md'}
                            fontSize={'12px'}
                            h='300px'
                        >
                            <BarChartPlot data={TRANSACTIONS_DATA?.filter((transaction)=>transaction?.vendor === USER_DATA?._id)}/>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
  )
}

export default Page;

const Transaction_Section = ({TRANSACTIONS_DATA,USER_DATA})=>{
    const [search_query, set_search_query]=useState('')
    const router = useRouter();
    return(
        <TableContainer boxShadow={'md'}>
            <Table variant='simple'>
                <Thead bg='#E4F0FC'>
                    <Tr>
                        <Th>Product</Th>
                        <Th>Date</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {TRANSACTIONS_DATA?.filter((transaction)=>transaction?.vendor === USER_DATA?._id)?.reverse()?.map((transaction)=>{
                        return(
                            <Tr key={transaction?._id} >
                                <Td>
                                    <HStack>
                                        <Avatar size={'sm'} src='' name={transaction?.product_ref?.name}/>
                                        <Box>
                                            <Text fontSize={'12px'}>{transaction?.product_ref?.name}</Text>
                                            <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{transaction?._id}</Text>
                                        </Box>
                                    </HStack>
                                </Td>
                                <Td>
                                    <Box>
                                        <Text fontWeight={''}>{moment(transaction?.createdAt).format("DD MMM YY")}</Text>
                                        <Text fontSize={'sm'} color='gray.400'>{moment(transaction?.createdAt).format("h:mm a")}</Text>
                                    </Box>
                                </Td>
                                <Td>KES {transaction?.payment_total}</Td>
                                <Td><Badge colorScheme={transaction?.payment? 'green':'orange'}>{transaction?.status}</Badge></Td>
                                <Td>
                                    <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/transactions/view?uid=${USER_DATA?._id}&store_id=${USER_DATA?.store_ref[0]?._id}&transaction_id=${transaction?._id}`)})}>
                                        <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                        <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
                                    </HStack>
                                </Td>
                            </Tr>
                        )})
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}
const Products_Section = ({PRODUCTS_DATA,USER_DATA})=>{
    const [search_query, set_search_query]=useState('')
    const router = useRouter();
    return(
            <TableContainer boxShadow={'md'}>
                <Table variant='simple'>
                    <Thead bg='#E4F0FC'>
                        <Tr>
                            <Th>Product</Th>
                            <Th>Date</Th>
                            <Th>Stock</Th>
                            <Th>Price</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {PRODUCTS_DATA?.filter((vendor)=>vendor?.owner_ref_id === USER_DATA?._id)?.filter((product)=>product?.name?.toLowerCase().includes(search_query?.toLowerCase())).reverse()?.map((product)=>{
                            const sold_products = product?.transactions?.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.items,
                                0,
                            );
                            console.log(product)
                            return(
                                <Tr key={product?._id} >
                                    <Td>
                                        <HStack>
                                            <Avatar size={'sm'} src='' name={product?.name}/>
                                            <Box>
                                                <Text>{product?.name}</Text>
                                                <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{product?.category}</Text>
                                            </Box>
                                        </HStack>
                                    </Td>
                                    <Td>
                                        <Box>
                                            <Text fontWeight={''}>{moment(product?.createdAt).format("DD MMM YY")}</Text>
                                            <Text fontSize={'sm'} color='gray.400'>{moment(product?.createdAt).format("h:mm a")}</Text>
                                        </Box>
                                    </Td>
                                    <Td>
                                        <Progress 
                                            value={product?.items - sold_products}
                                            colorScheme={product?.items - sold_products  === 0? 'orange' : 'green'} 
                                            size={'xs'}
                                            max={product?.items}
                                        />
                                        <Text fontSize={'sm'}>{product?.items - sold_products <= 0 ? 'out of stock' : `${product?.items - sold_products} in stock`}</Text>
                                    </Td>
                                    <Td>KES {product?.price}</Td>
                                    <Td>
                                        <HStack color='gray.600' cursor={'pointer'} pr='1' onClick={(()=>{router.push(`/dashboard/products/view?uid=${USER_DATA?._id}&store_id=${USER_DATA?.store_ref[0]?._id}&product_id=${product?._id}`)})}>
                                            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                            <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
                                        </HStack>
                                    </Td>
                                </Tr>
                            )})
                        }
                    </Tbody>
                </Table>
            </TableContainer>
    )
}
