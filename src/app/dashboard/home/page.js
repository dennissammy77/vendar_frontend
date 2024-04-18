'use client'
import { UserContext } from '@/components/providers/user.context';
import BarChartPlot from '@/components/ui/analytics/bar.dash-analytics.ui';
import { Badge, Box, Button, Divider, Flex, Grid, GridItem, HStack, Icon, Image, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Table, TableCaption, TableContainer, Tag, TagLabel, TagLeftIcon, Tbody, Td, Text, Th, Thead, Tr, Wrap } from '@chakra-ui/react'
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { CiTrophy } from 'react-icons/ci';
import { FaStore, FaTrophy } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  const USER_DATA = user?.data?.data;
  const searchParams = useSearchParams();
  const STORE_ID = searchParams.get('store_id');
  const STORE_DATA = USER_DATA?.store_ref?.find((store)=>store?._id === STORE_ID);

  return (
    <Box p=''>
      <Text fontSize={'xl'} my='2'> Welcome 👋, <br/>{USER_DATA?.name} </Text>
      <Wrap spacing='2' my=''>
          {user?.data?.data?.store_ref?.map((store)=>{
              return(
                  <Text 
                    fontSize={store?._id === STORE_ID?'32px':'md'} 
                    fontWeight={store?._id === STORE_ID?'bold':''} 
                    onClick={(()=>{router.replace(`/dashboard/home?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})} 
                    cursor={'pointer'}
                    borderRight={'1px solid'}
                    borderColor={'#E4F0FC'}
                    px='4'
                  >
                    {store?.name}
                  </Text>
              )
          })}
      </Wrap>
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
      {/**Stats section end here */}
      {/**Leaderboard section start here */}
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
                  <Icon as={FaBagShopping} boxSize={'4'} color='gray.300'/>
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
      {/**Leaderboard section end here */}
    </Box>
  )
}

export default Page