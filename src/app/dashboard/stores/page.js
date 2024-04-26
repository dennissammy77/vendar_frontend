'use client'
import { Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Grid, GridItem, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Text } from '@chakra-ui/react'
import React, { useContext, useState } from 'react';
import { IoMdAdd } from "react-icons/io";

import { UserContext } from '@/components/providers/user.context';
import { FaStore } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FiSearch } from "react-icons/fi";
import StoreDetails from './components/StoreDetails';
import { useQuery } from '@tanstack/react-query';
import { FETCH_STORES_BY_OWNER } from '@/app/api/shop/route';
import { MdChevronRight } from 'react-icons/md';

import Cookies from 'universal-cookie';

function Page() {
    const router = useRouter();

    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const [search_query, set_search_query]=useState('');

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
    })

    const cookies = new Cookies();

    const active_store = cookies.get('active_store') || user?.data?.data?.store_ref[0]?._id;

    const [selected_active_store, set_selected_active_store] = useState(null || data?.data?.data[0]);
    
    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.300' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }

    const stores = data?.data?.data || user?.data?.data?.store_ref;
    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Stores</Text>
                {user?.data?.data?.account_type === 'vendor'? null : 
                    <Flex align='center' >
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Icon as={FiSearch} color='gray.500' ml='2'/>
                            </InputLeftElement>
                            <Input type='search' placeholder={'Search stores'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                        </InputGroup>
                        <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New</Button>
                    </Flex>
                }
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}/store_id=${selected_active_store}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Stores</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {isLoading?
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Spinner />
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching your stores...</Text>
                </Flex> 
            :
            <>
                {stores?.length === 0? 
                        <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                            <Icon as={FaStore} boxSize={'6'}/>
                            <Text>Create a<Text color='#4E2FD7' textDecoration={'1px solid underline'} cursor={'pointer'} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New store</Text>to start managing clients, products.</Text>
                        </Flex>
                    :
                    <Grid
                        templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                        templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
                        gap={4}
                        h='200px'
                        my='2'
                    >
                        <GridItem p='' borderRadius={'5'}>
                            <Box>
                                {stores?.filter((store)=>store?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((store,index)=>{
                                    return(
                                        <StoreItem store={store} index={index} key={store?._id} set_selected_active_store={set_selected_active_store} active_store={active_store}/>
                                    )
                                })}
                            </Box>
                        </GridItem>
                        <GridItem>
                            {selected_active_store ? 
                                <StoreDetails store={selected_active_store} active_store={active_store}/>
                                :
                                <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'}>
                                    <Icon as={FaStore} boxSize={'6'}/>
                                    <Text>Select a store to <br/>view details</Text>
                                </Flex>
                            }
                        </GridItem>
                    </Grid>
                }
            
            </>
            }
        </Box>
    )
}

export default Page;

const StoreItem = ({store, set_selected_active_store,active_store}) =>{
    return(
        <HStack align='center' bg='#E4F0FC' borderRadius={'md'} mb='2' p='4' spacing='4' cursor={'pointer'} border={'2px solid'} borderColor={'gray.300'} onClick={(()=>{set_selected_active_store(store)})}>
            <Icon as={FaStore} boxSize={'4'} color='gray.500'/>
            <Box>
                <Text fontWeight={'semibold'}>{store.name}</Text>
                <HStack>
                    <Badge fontSize="xs" colorScheme={store?.payment_plan === 'free'? 'orange' : 'green'}>{store?.payment_plan}</Badge>
                    {active_store === store?._id ? <Badge fontSize="xs" colorScheme={'purple'}>active</Badge> : null }
                </HStack>
            </Box>
        </HStack>
    )
}