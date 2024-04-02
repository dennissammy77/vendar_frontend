'use client'
import { Badge, Box, Button, Center, Flex, Grid, GridItem, HStack, Icon, Image, Input, InputGroup, InputLeftElement, SimpleGrid, Spinner, Text, Wrap } from '@chakra-ui/react'
import React, { useContext, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from 'react-icons/md';
import { UserContext } from '@/components/providers/user.context';
import { FaStore } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FiSearch } from "react-icons/fi";

function Page() {
    const {user} = useContext(UserContext);
    const existing_stores = user?.data?.data?.shop_ref;

    const [search_query, set_search_query]=useState('')

    const [active_store, set_active_store] = useState('');
    const router = useRouter();
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
        {existing_stores?.length === 0? 
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
                    {existing_stores?
                        <Box>
                            {existing_stores?.filter((store)=>store?.name?.toLowerCase().includes(search_query?.toLowerCase()))?.map((store,index)=>{
                                return(
                                    <StoreItem store={store} index={index} key={store?._id} set_active_store={set_active_store}/>
                                )
                            })}
                        </Box>
                        :
                        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='100%'>
                            <Spinner />
                            <Text>Fetching stores</Text>
                        </Flex>
                    }
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
    </Box>
  )
}

export default Page;

const StoreItem = ({store,index,set_active_store}) =>{
    return(
        <HStack align='center' bg='#E4F0FC' borderRadius={'md'} mb='2' p='4' spacing='4' cursor={'pointer'} border={'2px solid'} borderColor={'gray.300'} onClick={(()=>{set_active_store(store)})}>
            <Box w='50px' h='50px' borderRadius={'md'} bg='#000000'/>
            <Text fontWeight={'semibold'}>{store.name}</Text>
        </HStack>
    )
}

const StoreDetails = ({store})=>{
    return(
        <Box bg='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4'>
            <Flex justify={'space-between'}>
                <HStack>
                    <Text fontSize={'x-large'} fontWeight={'bold'} my='2'>{store?.name}</Text>
                    {/**
                     * 
                    <Badge color={'#fff'} bg={'#4E2FD7'}>Active</Badge>
                     */}
                </HStack>
                <HStack>
                    <Icon color='gray.600' boxSize='5' as={IoMdSettings}/>
                </HStack>
            </Flex>
            <Text my='2'>{store?.description}</Text>
            {/**Contact */}
            <Box>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={MdEmail}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.email}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={FaPhone}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.mobile}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={FaLocationDot}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.location}</Text>
                </HStack>
            </Box>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Staff:</Text>
                <Text>{store?.staff?.length}</Text>
            </HStack>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Vendors:</Text>
                <Text>{store?.vendors?.length}</Text>
            </HStack>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Products:</Text>
                <Text>{store?.products?.length}</Text>
            </HStack>
            {/**
             * 
            <Box my='4'>
                <Text fontWeight={'bold'}>Most Popular Items</Text>
                <SimpleGrid minChildWidth='100px' spacing='10px'>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                </SimpleGrid>
            </Box>
             */}
        </Box>
    )
}

const shops = [
    {name:'one'},
    {name:'two'},
    {name:'three'},
    {name:'four'},
    {name:'five'},
    {name:'six'},
]