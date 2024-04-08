'use client'
import { Box, Button, Flex, Grid, GridItem, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Text } from '@chakra-ui/react'
import React, { useContext, useState } from 'react';
import { IoMdAdd } from "react-icons/io";

import { UserContext } from '@/components/providers/user.context';
import { FaStore } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FiSearch } from "react-icons/fi";
import StoreDetails from './components/StoreDetails';
import { useQuery } from '@tanstack/react-query';
import { FETCH_STORES_BY_OWNER } from '@/app/api/shop/route';


function Page() {
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;

    const [search_query, set_search_query]=useState('')

    const router = useRouter();

    const {data, isLoading} = useQuery({
        queryKey: ['stores_data', {USER_ID, search_query}],
        queryFn: () => FETCH_STORES_BY_OWNER(USER_ID)
    })

    const [active_store, set_active_store] = useState(
        data?.data?.data[0]
    );
    
    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.300' my='2'>{data?.data?.message}</Text>
            </Flex>
        )
    }
    const stores = data?.data?.data;
    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Stores</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search stores'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New</Button>
                </Flex>
            </Flex>
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
                                        <StoreItem store={store} index={index} key={store?._id} set_active_store={set_active_store}/>
                                    )
                                })}
                            </Box>
                        </GridItem>
                        <GridItem>
                            {active_store ? 
                                <StoreDetails store={active_store}/>
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

const StoreItem = ({store, set_active_store}) =>{
    return(
        <HStack align='center' bg='#E4F0FC' borderRadius={'md'} mb='2' p='4' spacing='4' cursor={'pointer'} border={'2px solid'} borderColor={'gray.300'} onClick={(()=>{set_active_store(store)})}>
            <Icon as={FaStore} boxSize={'4'} color='gray.500'/>
            <Text fontWeight={'semibold'}>{store.name}</Text>
        </HStack>
    )
}