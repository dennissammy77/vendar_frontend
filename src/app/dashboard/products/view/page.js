'use client'

import React, { useContext, useState } from 'react'
// utils
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import Link from 'next/link';
// styling
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, Spinner, HStack, useDisclosure, Alert, AlertIcon, Tabs, TabList, Tab, Divider, TabPanels, TabPanel, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Avatar, StepStatus, position, useToast, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react'
// api
import { FETCH_PRODUCT_DATA, UPDATE_STORE_PRODUCT } from '@/app/api/product/route';
// icons
import { CHEVRON_DOWN_ICON, CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON, DELETE_ICON, EDIT_ICON, MANAGE_ICON, SHOPPING_CART_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons';
// components
import DELETE_PRODUCT_ALERT from '@/components/ui/product/DELETE_PRODUCT_ALERT';
//import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import BarChartPlot, { PRODUCT_DATA_TRACKER } from '@/components/ui/analytics/bar.dash-analytics.ui';
import { FETCH_ALL_STORE_TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS } from '@/app/api/transaction/route';


function Page() {
    // utils
    const {user} = useContext(UserContext);
    const toast = useToast()
    // config
    const USER_ID = user?.data?.data?._id;
    const USER_DATA = user?.data?.data;
    const searchParams = useSearchParams();
    const PRODUCT_ID = searchParams.get('product_id');
    const STORE_ID = searchParams.get('store_id');
	const [loading_status,set_loading_status]=useState(false)
	const [tag,set_tag]=useState('analysis')
	const [week,set_week]=useState(moment().week())
    const DELETE_PRODUCT_ALERT_DISCLOSURE = useDisclosure();
    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['product data', {PRODUCT_ID,loading_status}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });
    const {data: Transactions_data, isLoading: AnalyticsLoading } = useQuery({
        queryKey: ['transactions data', {PRODUCT_ID,tag,week}],
        queryFn: () => FETCH_ALL_STORE_TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS(USER_ID,STORE_ID,PRODUCT_ID,week,tag)
    });

    const TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS = Transactions_data?.data?.data;
    const TRANSACTION_DETAILS_DATA_FOR_PRODUCT_ANALYTICS = Transactions_data?.data?.details;
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
    // DATA
    const PRODUCT_DATA = data?.data?.data;
    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    return (
        <Box>
            <DELETE_PRODUCT_ALERT isOpen={DELETE_PRODUCT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_PRODUCT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} PRODUCT_DATA={PRODUCT_DATA}/>
            <Flex align='center' justifyContent={'space-between'}>
                <Text fontWeight='bold' fontSize='32px'>Product Data</Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<CHEVRON_DOWN_ICON />} bgColor={'#4E2FD7'} color='#ffffff'> Action </MenuButton>
                    <MenuList>
                        <MenuItem icon={<SHOPPING_CART_ICON style={{fontSize:'16px'}}/>} as='a' href={`/dashboard/products/edit/restock?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Restock</MenuItem>
                        <MenuItem icon={<EDIT_ICON style={{fontSize:'16px'}}/>} as='a' href={`/dashboard/products/edit?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Edit</MenuItem>
                        <MenuItem icon={<DELETE_ICON style={{fontSize:'16px'}}/>} onClick={DELETE_PRODUCT_ALERT_DISCLOSURE?.onOpen}>Delete</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            
            {PRODUCT_DATA?.product_status?.approval_status === false && (
                <Alert status='info'>
                    <AlertIcon />
                    <Box>
                        <Text>
                            This product is pending approval. This is because the product has recently been added or has recently been restocked.
                        </Text>
                        {USER_DATA?.account_type === 'vendor'?
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
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products?uid=${USER_ID}&store_id=${STORE_ID}`}>Products</BreadcrumbLink>
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
                                    <Text fontWeight={''}>KES {PRODUCT_DATA?.price}</Text>
                                </Box>
                                <Box my='2'>
                                    <Text fontWeight={'bold'}>Buying Price</Text>
                                    <Text fontWeight={''}>KES {PRODUCT_DATA?.buying_price}</Text>
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
                    {AnalyticsLoading? 
                        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                            <Spinner />
                            <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching product details</Text>
                        </Flex>
                        :
                        <>
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
                            <Box bg='#FFFFFF' p='4' boxShadow={'md'} fontSize={'12px'} mt='2'>
                                <Text fontSize={'20px'}>Analytics</Text>
                            </Box>
                            <Box bg='#FFFFFF' p='1' boxShadow={'md'} fontSize={'12px'} h='500px' >
                                {TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS?.length === 0? 
                                    <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                        <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
                                        <Text>No transactions found.</Text>
                                    </Flex>
                                    :
                                    <PRODUCT_DATA_TRACKER data={TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS}/>
                                }
                            </Box>
                            <Box bg='#FFFFFF' p='4' boxShadow={'md'} fontSize={'12px'} mt='2'>
                                <Text fontSize={'20px'}>Sales</Text>
                            </Box>
                            <Box bg='#FFFFFF' p='4' boxShadow={'md'} fontSize={'12px'}>
                                {TRANSACTION_DETAILS_DATA_FOR_PRODUCT_ANALYTICS?.length === 0? 
                                    <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                        <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
                                        <Text>No transactions found.</Text>
                                    </Flex>
                                    :
                                    <Transaction_Section TRANSACTIONS_DATA={TRANSACTION_DETAILS_DATA_FOR_PRODUCT_ANALYTICS} USER_DATA={USER_DATA}/>
                                }
                            </Box>
                        </>
                    }
                </>

            }
        </Box>
  )
}

export default Page;

const Transaction_Section = ({TRANSACTIONS_DATA,USER_DATA})=>{
    const STORE_ID = FETCH_ACTIVE_STORE_ID()
    return(
        <TableContainer>
            <Table variant='simple'>
                <Thead bg='#E4F0FC'>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Items</Th>
                        <Th>Amount</Th>
                        <Th>Method</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {TRANSACTIONS_DATA?.reverse()?.map((transaction)=>{
                        return(
                            <Tr key={transaction?._id} >
                                <Td>
                                    <Box>
                                        <Text fontWeight={''}>{moment(transaction?.createdAt).format("ddd")}-{moment(transaction?.createdAt).format("DD MMM YY")}</Text>
                                        <Text fontSize={'sm'} color='gray.400'>{moment(transaction?.createdAt).format("h:mm a")}</Text>
                                    </Box>
                                </Td>
                                <Td>{transaction?.items}</Td>
                                <Td>KES {transaction?.sales}</Td>
                                <Td>{transaction?.payment_method}</Td>
                                <Td><Badge colorScheme={transaction?.payment? 'green':'orange'}>{transaction?.status}</Badge></Td>
                                <Td>
                                    <Link href={`/dashboard/transactions/view?uid=${USER_DATA?._id}&store_id=${STORE_ID}&transaction_id=${transaction?._id}`}>
                                        <HStack color='gray.600' cursor={'pointer'} pr='1'>
                                            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                            <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
                                        </HStack>
                                    </Link>
                                </Td>
                            </Tr>
                        )})
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}
