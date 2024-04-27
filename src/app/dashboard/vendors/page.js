'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Badge } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { MdChevronRight } from 'react-icons/md';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import Cookies from 'universal-cookie';


export default function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const [search_query, set_search_query]=useState('')


    const cookies = new Cookies();

    const STORE_ID = cookies.get('active_store') || user?.data?.data?.store_ref[0]?._id;
    const ACCOUNT_TYPE = 'vendor';

    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE)
    });

    const VENDORS_DATA = data?.data?.data;

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>Error occured fetching store users</Text>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Vendors</Text>
                {user?.data?.data?.account_type === 'vendor'? null :
                    <Flex align='center' >
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Icon as={FiSearch} color='gray.500' ml='2'/>
                            </InputLeftElement>
                            <Input type='search' placeholder={'Search vendors'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                        </InputGroup>
                        <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/vendors/new?uid=${user?.data?.data?._id}&&store_id=${STORE_ID}`)})}>New</Button>
                    </Flex>
                }
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Vendors</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store users</Text>
                </Flex>
                :
                <>
                    <TableContainer boxShadow={'md'}>
                        <Table variant='simple'>
                            <Thead bg='#E4F0FC'>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Phone</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {VENDORS_DATA?.filter((vendor)=>vendor?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((vendor)=>{
                                    return(
                                        <Tr key={vendor?._id} >
                                            <Td>
                                                <HStack>
                                                    <Avatar size={'sm'} src='' name={vendor?.name}/>
                                                    <Box>
                                                        <Text>{vendor?.name}</Text>
                                                        <Text fontSize={'10px'} fontWeight={'bold'} color='gray.400' cursor={'pointer'} _hover={{textDecoration:'1px solid underline'}}>{vendor?.email}</Text>
                                                    </Box>
                                                </HStack>
                                            </Td>
                                            <Td>{vendor?.mobile}</Td>
                                            <Td><Badge colorScheme={vendor?.account_status_ref?.suspension_status ? 'orange':'green'}>{vendor?.account_status_ref?.suspension_status ? 'suspended' : 'active'}</Badge></Td>
                                            <Td>
                                                {user?.data?.data?._id === vendor?._id ? 
                                                    null
                                                    :
                                                    <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/vendors/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&account_id=${vendor?._id}`)})}>
                                                        <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
                                                        <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
                                                    </HStack>
                                                }
                                            </Td>
                                        </Tr>
                                    )})
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>
            }
        </Box>
    )
}

const VendorItem=({vendor,STORE_ID})=>{
    const router = useRouter();
    const {user} = useContext(UserContext)
  
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
          <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/vendors/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&account_id=${vendor?._id}`)})}>
              <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
              <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
          </HStack>
        }
      </Flex>
    )
  }