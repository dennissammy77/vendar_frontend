'use client'

import React, { useContext, useState } from 'react'
// utils
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import Link from 'next/link';
// styling
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, Spinner, HStack, useDisclosure, Alert, AlertIcon, Tabs, TabList, Tab, Divider, TabPanels, TabPanel, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Avatar, StepStatus, position, useToast} from '@chakra-ui/react'
// api
import { FETCH_PRODUCT_DATA, UPDATE_STORE_PRODUCT } from '@/app/api/product/route';
// icons
import { IoMdSettings } from 'react-icons/io';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { MdAddShoppingCart, MdChevronRight, MdOutlineDeleteOutline } from 'react-icons/md'
import { GrFormEdit } from 'react-icons/gr';
// components
import DELETE_PRODUCT_ALERT from '@/components/ui/product/DELETE_PRODUCT_ALERT';
//import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
import { CHEVRON_RIGHT_ICON, DELETE_ICON, EDIT_ICON, MANAGE_ICON, SHOPPING_CART_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';


function Page() {
    // utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const toast = useToast()
    // config
    const USER_ID = user?.data?.data?._id;
    const USER_DATA = user?.data?.data;
    const searchParams = useSearchParams();
    const PRODUCT_ID = searchParams.get('product_id');
    const STORE_ID = searchParams.get('store_id');
	const [loading_status,set_loading_status]=useState(false)
    const DELETE_PRODUCT_ALERT_DISCLOSURE = useDisclosure();
    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['product data', {PRODUCT_ID,loading_status}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });
	const HANDLE_APPROVE_PRODUCT = async()=>{
		set_loading_status(true);
		const data = {
			suspension_status:PRODUCT_DATA?.product_status?.suspension_status,
			suspension_reason:PRODUCT_DATA?.product_status?.suspension_reason,
			approval_status:true,
			deletion_status:PRODUCT_DATA?.product_status?.deletion_status,
			publish_status:PRODUCT_DATA?.product_status?.publish_status
		};
		const FLAG = 'status';
		try{
            await UPDATE_STORE_PRODUCT(data, STORE_ID, USER_ID, PRODUCT_ID, FLAG).then((response)=>{
                if(response?.data?.error === true){
                    return toast({ title: `Error!:${response?.data?.message}`,description: ``, status: 'warning', variant: 'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!: Product updated successfully', description: ``, status: 'success', variant: 'left-accent', position:'top-left',isClosable: true });
            })
            set_loading_status(false);
    }catch(error){
            set_loading_status(false);
            return toast({ title: `${error}`, description:``, status:'error', variant: 'left-accent', position: 'top-left', isClosable: true })
		}
	};
    // DATA
    const PRODUCT_DATA = data?.data?.data;
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <DELETE_PRODUCT_ALERT isOpen={DELETE_PRODUCT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_PRODUCT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} PRODUCT_ID={PRODUCT_ID} PRODUCT_DATA={PRODUCT_DATA}/>
            <Text fontWeight='bold' fontSize='32px'>Product Data</Text>
            {PRODUCT_DATA?.product_status?.approval_status === false && (
                <Alert status='info'>
                    <AlertIcon />
                    <Box>
                        <Text>
                            This product is pending approval. This is because the product has recently been added or has recently been restocked.
                        </Text>
                        {user?.data?.data?.account_type === 'vendor'?
                            null
                        :
							<>
								{loading_status? 
									<Button isLoading loadingText='Approving Product...' variant={'ghost'}/>
								:
								    <Button bg='#05232e' color='#FFFFFF' onClick={HANDLE_APPROVE_PRODUCT}>Approve</Button>
								}
							</>
						}
                    </Box>
                </Alert>
            )}
            {PRODUCT_DATA?.items === 0 ? 
                <Alert status='warning' mt='2'>
                    <AlertIcon />
                    <Box>
                        <Text>
                            Seems your product is out of stock.
                        </Text>
                        <Link href={`/dashboard/products/edit/restock?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>
                            <Button bg='#05232e' color='#FFFFFF' rightIcon={<SHOPPING_CART_ICON/>}>Restock</Button>
                        </Link>
                    </Box>
                </Alert>
            : 
                null 
            }
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='4'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>Products</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>{PRODUCT_DATA?.name}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching product details</Text>
                </Flex>
                :
                <>
                    <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                        <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' cursor={'pointer'}>
                            <Link href={`/dashboard/products/edit/restock?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>
                                <HStack p='1' px='2' color='#FFFFFF' bg='#05232e' borderRadius={'full'}>
                                    <Text fontWeight={'bold'} fontSize={'md'}>Restock</Text>
                                    <Icon boxSize='4' as={SHOPPING_CART_ICON} cursor='pointer'/>
                                </HStack>
                            </Link>
                            <Link href={`/dashboard/products/edit?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>
                                <HStack>
                                    <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                                    <Icon boxSize='6' as={EDIT_ICON} cursor='pointer'/>
                                </HStack>
                            </Link>
                            <HStack onClick={DELETE_PRODUCT_ALERT_DISCLOSURE?.onOpen}>
                                <Text fontWeight={'bold'} fontSize={'md'}>Delete</Text>
                                <Icon boxSize='6' as={DELETE_ICON} cursor='pointer'/>
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
                                    <Text fontWeight={''}>{PRODUCT_DATA?.items === 0 ? 'out of stock' : PRODUCT_DATA?.items}</Text>
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
                                    <Text fontWeight={''} my='2'>Name: {PRODUCT_DATA?.owner_ref_id?.name}</Text>
                                    <Text fontWeight={''} my='2'>Mobile: {PRODUCT_DATA?.owner_ref_id?.mobile}</Text>
                                    <Text fontWeight={''} my='2'>Account: {PRODUCT_DATA?.owner_ref_id?.account_type}</Text>
                                </Box>
                            </GridItem>
                        </Grid>
                        <Text fontWeight={'bold'} my='2'>Description</Text>
                        <Text>{PRODUCT_DATA?.description}</Text>
                    </Box>
                    <Tabs variant='soft-rounded' colorScheme='blue' isLazy my='4' w='100%'>
                        <TabList my='2'>
                            <Tab>Transactions</Tab>
                            {/**<Tab>Data</Tab>*/}
                        </TabList>
                        <Divider/>
                        <TabPanels>
                            <TabPanel>
                                {PRODUCT_DATA?.transactions?.length === 0? 
                                    <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                        <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
                                        <Text>This product does not have any transactions at the moment.</Text>
                                    </Flex>
                                    :
                                    <Transaction_Section TRANSACTIONS_DATA={PRODUCT_DATA?.transactions} USER_DATA={USER_DATA}/>
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
                                    {PRODUCT_DATA?.transactions?.length === 0? 
                                        <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                            <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
                                            <Text>This product does not have any transactions at the moment.</Text>
                                        </Flex>
                                        :
                                        <BarChartPlot data={PRODUCT_DATA?.transactions}/>
                                    }
                                </Box>
                            </TabPanel>
                             */}
                        </TabPanels>
                    </Tabs>
                </>

            }
        </Box>
  )
}

export default Page;

const Transaction_Section = ({TRANSACTIONS_DATA,USER_DATA})=>{
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
                                        <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
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
