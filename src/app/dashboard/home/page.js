'use client'

import React, { useContext } from 'react';
// util
import moment from 'moment';
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'universal-cookie';
import { useQuery } from '@tanstack/react-query';
// component
import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
// styling
import { Badge, Box, Divider, Flex, Grid, GridItem, HStack, Icon, Image, Spinner, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Table, TableCaption, TableContainer, Tag, TagLabel, TagLeftIcon, Tbody, Td, Text, Th, Thead, Tr, Wrap } from '@chakra-ui/react'
// icons
import { PEOPLE_ICON, PRODUCT_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_STORE_DATA } from '@/app/api/shop/route';



function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  const USER_DATA = user?.data?.data;
  const USER_ID = user?.data?.data?._id;

  const cookies = new Cookies();

  const STORE_ID = cookies.get('active_store') || user?.data?.data?.store_ref[0]?._id;

  const {data, isLoading} = useQuery({
      queryKey: ['store_data', {STORE_ID, USER_ID}],
      queryFn: () => FETCH_STORE_DATA(STORE_ID,USER_ID),
      enabled: USER_ID !== undefined && STORE_ID !== undefined
  })
  const STORE_DATA = data?.data?.data;

  if (isLoading){
    return (
      <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
          <Spinner />
          <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting Up your dashboard</Text>
      </Flex>
      )
  }

  return (
    <Box p=''>
      <Text fontSize={'xl'} my='2'> Welcome 👋, {USER_DATA?.name} </Text>
      <Text 
        fontSize={'32px'}
        fontWeight={'bold'}
        cursor={'pointer'}
        borderRight={'1px solid'}
        borderColor={'#E4F0FC'}
        py='2'
      >
        {STORE_DATA?.name}
      </Text>
      {/**Stats section start here */}
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
          {STORE_DATA?.transactions?.length === 0?
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='100%' textAlign={'center'}>
              <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>No transactions found <br/>start by<br/>creating new sales.</Text>
            </Flex>
          :
            <BarChartPlot data={STORE_DATA?.transactions}/>
          }
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
            <StatNumber fontSize={'lg'} my='1'>
              <Icon as={PEOPLE_ICON} mx='4'/>
              {STORE_DATA?.vendors?.length}
            </StatNumber>
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
            <StatNumber fontSize={'lg'} my='1'>
              <Icon as={PRODUCT_ICON} mx='4'/>
              {STORE_DATA?.products?.length}
            </StatNumber>
          </Stat>
          <Stat
            bg='#Cfc7f1'
            p='4'
            borderRadius={20}
            boxShadow={'sm'}
            align='center'
          >
            <StatLabel fontSize='lg'>Transactions</StatLabel>
            <StatNumber fontSize={'lg'} my='1'>
              <Icon as={TRANSACTION_ICON} mx='4'/>
              {STORE_DATA?.transactions?.length}
            </StatNumber>
          </Stat>
        </GridItem>
      </Grid>
      {/**Stats section end here */}
      {/**Leaderboard section start here */}
      {STORE_DATA?.transactions?.length === 0?
      null:
        <Grid
          templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
          templateColumns={{base:'repeat(1, 1fr)',md:'repeat(3, 1fr)'}}
          gap={4}
          my='4'
        >
          <GridItem
            colSpan={2}
            bg='#FFFFFF'
            p='4'
            borderRadius={20}
            boxShadow={'md'}
          >
            <Text fontSize={'2xl'}>Recent Transactions</Text>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Amount</Th>
                    <Th>Method</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {STORE_DATA?.transactions?.slice(-3).reverse().map((transaction)=>{
                    return(
                      <Tr>
                        <Td>{transaction?.payment_total}</Td>
                        <Td>{transaction?.payment_method}</Td>
                        <Td>
                            <Box>
                                <Text fontWeight={''}>{moment(transaction?.createdAt).format("DD MMM YY")}</Text>
                                <Text fontSize={'sm'} color='gray.400'>{moment(transaction?.createdAt).format("h:mm a")}</Text>
                            </Box>
                        </Td>
                        <Td>
                          <Badge colorScheme={transaction?.payment? 'green':'orange'}>{transaction?.status}</Badge>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
          <GridItem
            colSpan={1}
            bg='#FFFFFF'
            p='4'
            borderRadius={20}
            boxShadow={'md'}
          >
            <Text fontSize={'2xl'}>Best Products</Text>
            <Text fontSize={'12px'} color='gray.400' my='1'>ranking based on transactions</Text>
            {STORE_DATA?.products?.sort((a, b) => b.transactions?.length - a?.transactions?.length)?.slice(0,3).map(product =>{
              return(
                <>
                  <HStack align='center' p='4' sapcing='2'>
                    <Icon as={PRODUCT_ICON} boxSize={'4'} color='gray.300'/>
                    <Box>
                      <Text fontSize={'md'}>{product?.name}</Text>
                      <Text fontSize={'sm'}>{product?.transactions?.length}</Text>
                    </Box>
                  </HStack>
                  <Divider/>
                </>
              )
            })}
          </GridItem>
        </Grid>
      }
      {/**Leaderboard section end here */}
    </Box>
  )
}

export default Page