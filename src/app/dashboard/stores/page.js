'use client'

import React, { useContext, useState } from 'react';
//styling
import { Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Grid, GridItem, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Text } from '@chakra-ui/react'
// util
import { useRouter } from 'next/navigation';
import { UserContext } from '@/components/providers/user.context';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'universal-cookie';
// icons
import { ADD_ICON, CHEVRON_RIGHT_ICON, SEARCH_ICON, STORE_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_STORES_BY_OWNER } from '@/app/api/shop/route';
//components
import StoreDetails from './components/StoreDetails';

function Page() {
    // utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const cookies = new Cookies();
    // config
    const USER_ID = user?.data?.data?._id;
    const [search_query, set_search_query]=useState('');
    const active_store = cookies.get('active_store') || user?.data?.data?.store_ref[0]?._id;
    // Functions
    const {data, isLoading} = useQuery({
        queryKey: ['stores_data', {USER_ID}],
        queryFn: async () => {
            let ACCOUNT_ID;
            switch (user?.data?.data?.account_type) {
                case 'owner':
                    ACCOUNT_ID = USER_ID;
                    await FETCH_STORES_BY_OWNER(ACCOUNT_ID)
                    break;
                case 'manager':
                    ACCOUNT_ID = user.data?.data?.store_ref[1]?.owner_ref_id;
                    await FETCH_STORES_BY_OWNER(ACCOUNT_ID)
                    break;
                case 'supervisor':
                    ACCOUNT_ID = user.data?.data?.store_ref[1]?.owner_ref_id;
                    await FETCH_STORES_BY_OWNER(ACCOUNT_ID)
                    break;
                default:
                    return null;
            }
        }
    });
    // DATA
    const stores = data?.data?.data || user?.data?.data?.store_ref;

    if (isLoading){
        return (
          <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
              <Spinner />
              <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching your stores...</Text>
          </Flex>
          )
      }
    
    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.300' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }

    if (stores?.length === 0){
        return (
            <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                <Icon as={STORE_ICON} boxSize={'6'}/>
                <Text>Create a<Text color='#4E2FD7' textDecoration={'1px solid underline'} cursor={'pointer'} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New store</Text>to start managing clients, products.</Text>
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Stores</Text>
                {user?.data?.data?.account_type === 'vendor'? null : 
                    <Flex align='center' >
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                            </InputLeftElement>
                            <Input type='search' placeholder={'Search stores'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                        </InputGroup>
                        <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<ADD_ICON />} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New</Button>
                    </Flex>
                }
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}&store_id=${active_store}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Stores</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {stores?.filter((store)=>store?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((store,index)=>{
                return(
                    <StoreDetails store={store} active_store={active_store}/>
                )
            })}
        </Box>
    )
}

export default Page;