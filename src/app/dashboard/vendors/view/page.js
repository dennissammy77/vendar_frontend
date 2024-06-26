'use client'
import React, { useContext, useState } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure, Tabs, TabList, Tab, Divider, TabPanels, TabPanel, Avatar, Progress, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react'
import { MdChevronRight, MdClose, MdDone, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { FETCH_VENDOR_STAKEHOLDER_DETAILS } from '@/app/api/auth/route';

import { TiUserDelete } from "react-icons/ti";
import DELETE_STAKEHOLDER_ACCOUNT_ALERT from '@/components/ui/user/DELETE_STAKEHOLDER_ACCOUNT_ALERT';
//import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
import moment from 'moment';
import { IoMdSettings } from 'react-icons/io';
import { GiShoppingBag } from 'react-icons/gi';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { CHEVRON_DOWN_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, EDIT_ICON, USER_DELETE_ICON } from '@/components/lib/constants/icons';
import { FETCH_STORE_PRODUCTS_BY_VENDOR } from '@/app/api/product/route';
import { FETCH_VENDOR_TRANSACTIONS_DATA } from '@/app/api/transaction/route';

function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();

    const searchParams = useSearchParams();
    const ACCOUNT_ID = searchParams.get('account_id');
    const STORE_ID = searchParams.get('store_id');
	const [week,set_week]=useState(moment().week())

    
    const {data, isLoading} = useQuery({
        queryKey: ['account_id', {ACCOUNT_ID}],
        queryFn: () => FETCH_VENDOR_STAKEHOLDER_DETAILS(ACCOUNT_ID)
    });

    const {data:PRODUCTS_RESULT} = useQuery({
        queryKey: ['vendor_products', {ACCOUNT_ID}],
        queryFn: () => FETCH_STORE_PRODUCTS_BY_VENDOR(ACCOUNT_ID,STORE_ID)
    });

    const {data:TRANSACTION_RESULT} = useQuery({
        queryKey: ['vendor_transactions', {ACCOUNT_ID,week}],
        queryFn: () => FETCH_VENDOR_TRANSACTIONS_DATA(ACCOUNT_ID,STORE_ID,week)
    });

    const USER_DATA = data?.data?.data;
    const PRODUCTS_DATA = PRODUCTS_RESULT?.data?.data;
    const TRANSACTIONS_DATA = TRANSACTION_RESULT?.data?.data;

    const HANDLE_WEEK_CHANGE=(sign)=>{
        if (week === 1 && sign === '-'){
            set_week(1)
            return;
        }
        switch (sign) {
            case '+':
                set_week(week + 1)
                break;
            case '-':
                set_week(week - 1)
                break;
            default:
                set_week(1)
                break;
        }
      }

    // const TRANSACTIONS_DATA = USER_DATA?.store_ref[0]?.transactions?.filter((transaction)=>transaction?.vendor === USER_DATA?._id);

    const DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE = useDisclosure()


    return (
        <Box>
            <DELETE_STAKEHOLDER_ACCOUNT_ALERT isOpen={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} USER_DATA={USER_DATA}/>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} my='2'>
                {/**
                 * Products tag & management goes here
                 * Search field, New product and product imports
                 */}
                <Text fontWeight='bold' fontSize={{base:'24px',md:'32px'}}>Vendor Data</Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<CHEVRON_DOWN_ICON />} bgColor={'#4E2FD7'} color='#ffffff'> Action </MenuButton>
                    <MenuList>
                        <MenuItem icon={<EDIT_ICON style={{fontSize:'16px'}}/>} as='a' href={`/dashboard/vendors/edit?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${ACCOUNT_ID}`}>Edit</MenuItem>
                        <MenuItem icon={<USER_DELETE_ICON style={{fontSize:'16px'}}/>} onClick={DELETE_STAKEHOLDER_ACCOUNT_ALERT_DISCLOSURE?.onOpen}>Delete</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/vendors?uid=${USER_ID}&store_id=${STORE_ID}`}>vendors</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{USER_DATA?.username || USER_DATA?.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
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
            <Box bg='#FFFFFF' p='4' boxShadow={'md'} fontSize={'12px'} mt='2'>
                <Flex justify={'space-between'}>
                    <Text fontSize={'24px'}>Summary</Text>
                    <HStack align='center' spacing='2' color='gray.600'>
                        <Icon as={CHEVRON_LEFT_ICON} boxSize={'5'} cursor='pointer' onClick={(()=>HANDLE_WEEK_CHANGE('-'))}/>
                        <Text fontSize={'sm'}>week {week}</Text>
                        <Icon as={CHEVRON_RIGHT_ICON} boxSize={'5'} cursor='pointer' onClick={(()=>HANDLE_WEEK_CHANGE('+'))}/>
                    </HStack>
                </Flex>
            </Box>
            <Tabs variant='soft-rounded' colorScheme='blue' isLazy my='4' w='100%'>
                <TabList my='2'>
                    <Tab>Products</Tab>
                    <Tab>Transactions</Tab>
                    {/**
                     * 
                    <Tab>Data</Tab>
                     */}
                </TabList>
                <Divider/>
                <TabPanels>
                    <TabPanel>
                        {PRODUCTS_DATA?.length === 0? 
                            <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                <Icon as={GiShoppingBag} boxSize={'6'}/>
                                <Text>This user has not added any products yet.</Text>
                            </Flex>
                            :
                            <Products_Section PRODUCTS_DATA={PRODUCTS_DATA} USER_DATA={USER_DATA}/>
                        }
                    </TabPanel>
                    <TabPanel>
                        {TRANSACTIONS_DATA?.length === 0? 
                            <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                <Icon as={LiaMoneyBillWaveSolid} boxSize={'6'}/>
                                <Text>This user does not have any transactions at the moment.</Text>
                            </Flex>
                            :
                            <Transaction_Section TRANSACTIONS_DATA={TRANSACTIONS_DATA} USER_DATA={USER_DATA}/>
                        }
                    </TabPanel>
                    {/**
                     * 
                    <TabPanel>
                        <Box
                            bg='#FFFFFF'
                            p='4'
                            borderRadius={20}
                            boxShadow={'md'}
                            fontSize={'12px'}
                            h='300px'
                        >
                            {TRANSACTIONS_DATA?.length === 0? 
                                <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                    <Icon as={LiaMoneyBillWaveSolid} boxSize={'6'}/>
                                    <Text>This user does not have any transactions at the moment.</Text>
                                </Flex>
                                :
                                <BarChartPlot data={TRANSACTIONS_DATA}/>
                            }
                        </Box>
                    </TabPanel>
                     */}
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
                    {TRANSACTIONS_DATA?.reverse()?.map((transaction)=>{
                        return(
                            <Tr key={transaction?._id} >
                                <Td>
                                    <HStack>
                                        <Avatar size={'sm'} src='' name={transaction?.product_name}/>
                                        <Box>
                                            <Text fontSize={'12px'}>{transaction?.product_name}</Text>
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
                                        <Badge 
                                            fontSize={'sm'}
                                            colorScheme={product?.items === 0 ? 'orange':'purple'}
                                        >
                                            {product?.items === 0 ? 'out of stock' : `${product?.items} in stock`}
                                        </Badge>
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
