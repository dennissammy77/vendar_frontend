'use client'

import React, { useContext, useState } from 'react';
//styling
import { Badge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Grid, GridItem, HStack, Icon, Input, InputGroup, InputLeftElement, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react'
// util
import { useRouter } from 'next/navigation';
import { UserContext } from '@/components/providers/user.context';
import { useQuery } from '@tanstack/react-query';
// icons
import { ADD_ICON, CHEVRON_RIGHT_ICON, SEARCH_ICON, STORE_ICON } from '@/components/lib/constants/icons';
// api
import { FETCH_STORES_BY_OWNER, REQUEST_TO_JOIN_STORE, FETCH_STORES_BY_VENDOR } from '@/app/api/shop/route';
//components
import StoreDetails from './components/StoreDetails';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import Link from 'next/link';

function Page() {
    // utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    // config
    const USER_ID = user?.data?.data?._id;
    const USER_DATA = user?.data?.data;
    const [search_query, set_search_query]=useState('');
    const [joinStoreId, setJoinStoreId] = useState('');
    const [joinStoreName, setJoinStoreName] = useState('');
    const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

    const submitJoinRequest = async()=>{
        try{
            setIsSubmittingJoin(true);
            const res = await REQUEST_TO_JOIN_STORE({ user_id: USER_ID, store_id: joinStoreId || undefined, store_name: joinStoreName || undefined });
            const isError = res?.data?.error || res?.response;
            if (isError){
                toast({ title: 'Join request failed', description: res?.data?.message || res?.response?.data?.message || 'Please try again', status: 'error' });
            } else {
                toast({ title: 'Request sent', description: res?.data?.message || 'Your request has been submitted', status: 'success' });
                setJoinStoreId('');
                setJoinStoreName('');
            }
        } finally {
            setIsSubmittingJoin(false);
        }
    }

    const active_store = FETCH_ACTIVE_STORE_ID() || USER_DATA?.store_ref[0]?._id;
    // Functions
    const {data: STORES_DATA, isLoading} = useQuery({
        queryKey: ['USER_STORES', {USER_ID, account_type: USER_DATA?.account_type}],
        queryFn: () => USER_DATA?.account_type === 'vendor' ? FETCH_STORES_BY_VENDOR(USER_ID) : FETCH_STORES_BY_OWNER(USER_ID),
        enabled: USER_ID !== undefined
    });
    // DATA
    const stores = STORES_DATA?.data?.data;

    if (isLoading){
        return (
          <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
              <Spinner />
              <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching your stores...</Text>
          </Flex>
          )
      }
    
    if (STORES_DATA?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    if (stores?.length === 0 && USER_DATA?.account_type === 'store_admin'){
        return (
            <Flex border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                <Icon as={STORE_ICON} boxSize={'6'}/>
                <Text>Create a<Text color='#4E2FD7' textDecoration={'1px solid underline'} cursor={'pointer'} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${USER_ID}`)})}>New store</Text>to start managing clients, products.</Text>
            </Flex>
        )
    }

    if (stores?.length === 0 && USER_DATA?.account_type === 'vendor'){
        return (
            <Flex  border='1px solid' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='10' h='100%' alignItems={'start'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                <Icon as={STORE_ICON} boxSize={'6'}/>
                <Text mb='4'>Request to join an existing store by ID or Name.</Text>
                <HStack spacing='3' w='100%' maxW='560px'>
                    <Input placeholder='Store ID (optional)' value={joinStoreId} onChange={(e)=>setJoinStoreId(e.target.value)} />
                    <Input placeholder='Store Name (optional)' value={joinStoreName} onChange={(e)=>setJoinStoreName(e.target.value)} />
                </HStack>
                <Button my={'4'} isLoading={isSubmittingJoin} onClick={submitJoinRequest} colorScheme='purple'>Request</Button>
            </Flex>
        )
    }

    return (
        <Box>
            {(USER_DATA?.account_type === 'store_admin' || USER_DATA?.account_type === 'super_admin') && (
                <>
                    <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                        <Text fontWeight='bold' fontSize='32px'>Stores</Text>
                        {USER_DATA?.account_type === 'vendor'? null : 
                            <Flex align='center' >
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                                    </InputLeftElement>
                                    <Input type='search' placeholder={'Search stores'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                                </InputGroup>
                                <Link href={`/dashboard/stores/new?uid=${USER_ID}`}>
                                    <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<ADD_ICON />}>New</Button>
                                </Link>
                            </Flex>
                        }
                    </Flex>
                    <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/dashboard/home?uid=${USER_ID}&store_id=${active_store}`}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
        
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>Stores</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    {stores?.filter((store)=>store?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((store,index)=>{
                        return(
                            <StoreDetails store={store} active_store={active_store} key={store?._id}/>
                        )
                    })}
                </>
            )}
            {USER_DATA?.account_type === 'vendor' && (
                <>
                    <Flex  border='1px solid' spacing='3' borderColor='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='2' h='100%' direction={'row'} justify={'space-between'} alignItems={'end'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'row'} w='100%' my='4'>
                        <Input placeholder='Enter store Id Join an existing store' value={joinStoreId} onChange={(e)=>setJoinStoreId(e.target.value)} />
                        <Button isLoading={isSubmittingJoin} onClick={submitJoinRequest} colorScheme='purple'>Request</Button>
                    </Flex>
                    {/* use a responsive grid  layout*/}
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} my={6}>
                        {stores?.filter((store)=>store?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((store,index)=>(
                            <Box
                                key={store?._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="md"
                                p={5}
                                bg="white"
                                _hover={{ boxShadow: "lg", borderColor: "#4E2FD7" }}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                textAlign="center"
                            >
                                <Icon as={STORE_ICON} boxSize={10} color="purple.500" mb={3} />
                                <Text fontWeight="bold" fontSize="lg" mb={1}>{store?.name}</Text>
                                <Text fontSize="sm" color="gray.500" mb={3}>{store?.description}</Text>
                                {store?.new_vendors?.some((v)=> (v?._id === USER_ID)) && (
                                    <Badge colorScheme='orange' mb={3}>Pending approval</Badge>
                                )}
                                <Button
                                    as={Link}
                                    href={`/dashboard/stores/${store?._id}?uid=${USER_ID}`}
                                    colorScheme="purple"
                                    size="sm"
                                    mt="auto"
                                    isDisabled={store?.new_vendors?.some((v)=> (v?._id === USER_ID))}
                                >
                                    View
                                </Button>
                            </Box>
                        ))}
                    </SimpleGrid>
                </>
            )}

        </Box>
    )
}

export default Page;