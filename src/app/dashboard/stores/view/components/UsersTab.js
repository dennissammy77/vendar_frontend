'use client'

import React, { useContext } from 'react'
// utils
import { UserContext } from '@/components/providers/user.context'
import moment from 'moment'
import { useRouter } from 'next/navigation'
// styling
import { Avatar, Badge, Box, Divider, Flex, HStack, Icon, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
// icons
// components
import { GiShoppingBag } from 'react-icons/gi'
import { IoMdAdd, IoMdSettings } from 'react-icons/io'
import { IoPeopleOutline } from 'react-icons/io5'
import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { ADD_ICON, MANAGE_ICON, PEOPLE_ICON, PRODUCT_ICON, STAFF_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons'

export default function UserTabs({store}) {
  return (
    <Tabs variant='soft-rounded' colorScheme='blue' isLazy w='100%'>
        <TabList my='2' overflowX='scroll'>
            <Tab>
              <Icon as={STAFF_ICON} boxSize='5' mx='1'/>
              Staff
            </Tab>
            <Tab>Vendors</Tab>
            <Tab>Products</Tab>
            <Tab>Transactions</Tab>
        </TabList>
        <Divider/>
        <TabPanels>
            <TabPanel>
              <StaffCard  store={store}/>
            </TabPanel>
            <TabPanel>
              <VendorCard store={store}/>
            </TabPanel>
            <TabPanel>
              <ProductCard store={store}/>
            </TabPanel>
            <TabPanel>
              <Transactions_Card store={store}/>
            </TabPanel>
        </TabPanels>
    </Tabs>
  )
}

const StaffCard=({store})=>{
  const router = useRouter();
  const {user} = useContext(UserContext);
  const USER_ID = user?.data?.data?._id
  return(
    <Box>
        
        <Flex justify={'end'} w='100%' align={'center'} fontWeight={'bold'} color='#4E2FD7'>
          <HStack borderRight='1px solid' borderColor='gray.200' px='2' _hover={{textDecoration:'1px solid underline'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/staff/new?uid=${USER_ID}&&store_id=${store?._id}`)})}>
            <Icon as={ADD_ICON} boxSize={'4'}  />
            <Text>New</Text>
          </HStack>
          <Text ml='2' onClick={(()=>{router.push(`/dashboard/staff?uid=${USER_ID}&store_id=${store?._id}`)})} _hover={{textDecoration:'1px solid underline'}} cursor='pointer'>view all</Text>          
        </Flex>
        {store?.staff?.map((staff)=>{
          return(
            <Box key={staff?._id} py='2'>
              <StaffItem staff={staff} STORE_ID={store?._id}/>
              <Divider py='1'/>
            </Box>
          )})
        }
    </Box>
  )
}

const VendorCard=({store})=>{
  const router = useRouter();
  const {user} = useContext(UserContext);
  const USER_ID = user?.data?.data?._id

  return(
    <Box>
        
        <Flex justify={'end'} w='100%' align={'center'} fontWeight={'bold'} color='#4E2FD7'>
          <HStack borderRight='1px solid' borderColor='gray.200' px='2' _hover={{textDecoration:'1px solid underline'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/vendors/new?uid=${USER_ID}&&store_id=${store?._id}`)})}>
            <Icon as={ADD_ICON} boxSize={'4'}  />
            <Text>New</Text>
          </HStack>
          <Text ml='2' onClick={(()=>{router.push(`/dashboard/vendors?uid=${USER_ID}&store_id=${store?._id}`)})} _hover={{textDecoration:'1px solid underline'}} cursor='pointer'>view all</Text>          
        </Flex>
        {store?.vendors?.length === 0? 
          <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
            <Icon as={PEOPLE_ICON} boxSize={'6'}/>
            <Text>You do not have any vendors at the moment.</Text>
          </Flex>
        :
          <>
            {store?.vendors?.map((vendor)=>{
              return(
                <Box key={vendor?._id} py='2'>
                  <VendorItem vendor={vendor} STORE_ID={store?._id}/>
                  <Divider py='1'/>
                </Box>
              )})
            }
          </>
        }
    </Box>
  )
}

const ProductCard=({store})=>{
  const router = useRouter();
  const {user} = useContext(UserContext);
  const USER_ID = user?.data?.data?._id

  return(
    <Box>
        
        <Flex justify={'end'} w='100%' align={'center'} fontWeight={'bold'} color='#4E2FD7'>
          <HStack borderRight='1px solid' borderColor='gray.200' px='2' _hover={{textDecoration:'1px solid underline'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/products/new?uid=${USER_ID}&store_id=${store?._id}`)})}>
            <Icon as={ADD_ICON} boxSize={'4'}  />
            <Text>New</Text>
          </HStack>
          <Text ml='2' onClick={(()=>{router.push(`/dashboard/products?uid=${USER_ID}&&store_id=${store?._id}`)})} _hover={{textDecoration:'1px solid underline'}} cursor='pointer'>view all</Text>          
        </Flex>
        {store?.products?.length === 0? 
          <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
            <Icon as={PRODUCT_ICON} boxSize={'6'}/>
            <Text>You do not have any products at the moment.</Text>
          </Flex>
        :
          <>
            {store?.products?.map((product)=>{
              return(
                <Box key={product?._id} py='2'>
                  <ProductItem product={product} STORE_ID={store?._id}/>
                  <Divider py='1'/>
                </Box>
              )})
            }
          </>
        }
    </Box>
  )
}

const Transactions_Card=({store})=>{
  const router = useRouter();
  const {user} = useContext(UserContext)
  const USER_ID = user?.data?.data?._id

  return(
    <Box>
        
        <Flex justify={'end'} w='100%' align={'center'} fontWeight={'bold'} color='#4E2FD7'>
          <HStack borderRight='1px solid' borderColor='gray.200' px='2' _hover={{textDecoration:'1px solid underline'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/transactions/new?uid=${USER_ID}&store_id=${store?._id}`)})}>
            <Icon as={ADD_ICON} boxSize={'4'}  />
            <Text>New</Text>
          </HStack>
          <Text ml='2' onClick={(()=>{router.push(`/dashboard/transactions?uid=${USER_ID}&store_id=${store?._id}`)})} _hover={{textDecoration:'1px solid underline'}} cursor='pointer'>view all</Text>          
        </Flex>
        {store?.transactions?.length === 0? 
          <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
            <Icon as={TRANSACTION_ICON} boxSize={'6'}/>
            <Text>You do not have any transactions at the moment.</Text>
          </Flex>
        :
          <TableContainer boxShadow={'md'}>
            <Table variant='simple'>
                <Thead bg='#E4F0FC'>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                  {store?.transactions?.map((transaction)=>{
                    return(
                          <Tr key={transaction?._id} >
                              <Td>
                                  <Box>
                                      <Text fontWeight={''}>{moment(transaction?.createdAt).format("DD MMM YY")}</Text>
                                      <Text fontSize={'sm'} color='gray.400'>{moment(transaction?.createdAt).format("h:mm a")}</Text>
                                  </Box>
                              </Td>
                              <Td>KES {transaction?.payment_total}</Td>
                              <Td><Badge colorScheme={transaction?.payment? 'green':'orange'}>{transaction?.status}</Badge></Td>
                              <Td>
                                  <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/transactions/view?uid=${USER_ID}&store_id=${store?._id}&transaction_id=${transaction?._id}`)})}>
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
        }
    </Box>
  )
}

const StaffItem=({staff,STORE_ID})=>{
  const router = useRouter();
  const {user} = useContext(UserContext);
  const USER_ID = user?.data?.data?._id

  return(
    <Flex p='2' borderRadius={'5'} align={'center'} justify={'space-between'}>
      <HStack spacing='2' >
        <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
        <Box>
          <Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
          <Text fontSize={'xs'}>{staff?.store_admin_account_ref?.role}</Text>
        </Box>
      </HStack>
      {staff?.store_admin_account_ref.role === 'owner'? 
        null
        :
        <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/staff/view?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${staff?._id}`)})}>
            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
            <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
        </HStack>
      }
    </Flex>
  )
}

const VendorItem=({vendor,STORE_ID})=>{
  const router = useRouter();
  const {user} = useContext(UserContext)
  const USER_ID = user?.data?.data?._id

  return(
    <Flex p='2' borderRadius={'5'} align={'center'} justify={'space-between'} transition={'.3s ease-in-out'} _hover={{bg:'gray.100'}} cursor={'pointer'}>
      <HStack spacing='2' >
        <Avatar name={vendor?.name} size='md' src={vendor?.profile_image_url}/>
        <Box>
          <Text fontSize={'sm'} fontWeight={'bold'}>{vendor?.name}</Text>
          <Text fontSize={'xs'} color='gray.400' my='1'>{vendor?.email}</Text>
          <Text fontSize={'xs'} color='gray.400'>{vendor?.mobile}</Text>
        </Box>
      </HStack>
      {user?.data?.data?._id === vendor?._id ? 
        null
        :
        <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/vendors/view?uid=${USER_ID}&store_id=${STORE_ID}&account_id=${vendor?._id}`)})}>
            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
            <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
        </HStack>
      }
    </Flex>
  )
}

const ProductItem=({product,STORE_ID})=>{
  const router = useRouter();
  const {user} = useContext(UserContext)
  const USER_ID = user?.data?.data?._id

  return(
    <Flex py='2' px='4' borderRadius={'5'} align={'center'} justify={'space-between'} transition={'.3s ease-in-out'} _hover={{bg:'gray.100'}} cursor={'pointer'}>
      <HStack spacing='2' >
        <Box>
          <Text fontSize={'md'} fontWeight={'bold'}>{product?.name}</Text>
          <Text fontSize={'sm'} color='gray.600' my='1'>{product?.price}</Text>
          <Text fontSize={'xs'} color='gray.400'>{product?.category}</Text>
        </Box>
      </HStack>
      <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/products/view?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${product?._id}`)})}>
          <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
          <Icon boxSize='4' as={MANAGE_ICON } cursor='pointer'/>
      </HStack>
    </Flex>
  )
}