'use client'
import { Box, Button, Text, Flex, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Avatar, Icon, InputGroup, InputLeftElement, Input, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { MdChevronRight } from 'react-icons/md';
import { IoMdAdd, IoMdSettings } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';


export default function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const [search_query, set_search_query]=useState('')


    const searchParams = useSearchParams();
    const STORE_ID = searchParams.get('store_id');
    const ACCOUNT_TYPE = 'store_admin';

    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID,search_query}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE)
    });

    const STAFF_DATA = data?.data?.data;

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
                <Text fontWeight='bold' fontSize='32px'>Staff</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search staff'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/staff/new?uid=${user?.data?.data?._id}&&store_id=${STORE_ID}`)})}>New</Button>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Staff</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <HStack spacing='2' my='4'>
                {user?.data?.data?.store_ref?.map((store)=>{
                    return(
                        <Tag size={'md'} key={store?._id} variant='outline' borderRadius='full' colorScheme={store?._id === STORE_ID?'blue':null} cursor='pointer' onClick={(()=>{router.replace(`/dashboard/staff?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>
                            <TagLeftIcon as={FaStore} />
                            <TagLabel>{store?.name}</TagLabel>
                        </Tag>
                    )
                })}
            </HStack>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store users</Text>
                </Flex>
                :
                <>
                    {STAFF_DATA?.filter((staff)=>staff?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((staff)=>{
                        return(
                            <Box key={staff?._id} py='2'>
                                <StaffItem staff={staff} STORE_ID={STORE_ID}/>
                                <Divider py='1'/>
                            </Box>
                        )})
                    }
                </>
            }
        </Box>
    )
}

const StaffItem=({staff,STORE_ID})=>{
    const router = useRouter();
    const {user} = useContext(UserContext)
  
    return(
      <Flex p='2' borderRadius={'5'} align={'center'} justify={'space-between'}>
        <HStack spacing='2' >
          <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
          <Box>
            <Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
            <Text fontSize={'xs'}>{staff?.store_admin_account_ref?.role}</Text>
          </Box>
        </HStack>
        {user?.data?.data?._id === staff?._id ? 
          null
          :
          <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/staff/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&account_id=${staff?._id}`)})}>
              <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
              <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
          </HStack>
        }
      </Flex>
    )
  }