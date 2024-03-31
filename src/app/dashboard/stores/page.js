'use client'
import { Badge, Box, Button, Flex, Grid, GridItem, HStack, Icon, Image, SimpleGrid, Text, Wrap } from '@chakra-ui/react'
import React from 'react';
import { IoMdAdd } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from 'react-icons/md';

function Page() {
  return (
    <Box>
        <Flex justify={'space-between'} align='center'>
            <Text fontWeight='bold' fontSize='32px'>Stores</Text>
            <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<IoMdAdd />}>Add Store</Button>
        </Flex>
        <Grid
            templateRows={{sm:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
            templateColumns={{sm:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
            gap={4}
            h='200px'
            my='2'
        >
            <GridItem p='' borderRadius={'5'}>
                <Box>
                    {shops?.map((shop,index)=>{
                        return(
                            <StoreItem store={shop} index={index}/>
                        )
                    })}
                </Box>
            </GridItem>
            <GridItem>
                <StoreDetails/>
            </GridItem>
            <GridItem bg='papayawhip' />
        </Grid>
    </Box>
  )
}

export default Page;

const StoreItem = ({store,index}) =>{
    return(
        <HStack align='center' bg='#E4F0FC' borderRadius={'md'} mb='2' p='4' spacing='4' cursor={'pointer'} border={'2px solid'} borderColor={index === 0?'#4E2FD7':'gray.300'}>
            <Box w='50px' h='50px' borderRadius={'md'} bg='#000000'/>
            <Box>
                <Text color={index === 0?'#4E2FD7':''} fontWeight={index === 0?'bold':''}>{store.name}</Text>
                <HStack fontSize={'xs'} fontWeight={'bold'}>
                    <Text color={index === 0? '':'gray.300'}>Status</Text>
                    <Badge color={index === 0? '#fff':'gray.300'} bg={index === 0? '#4E2FD7':'gray.400'} >Active</Badge>
                </HStack>
            </Box>
        </HStack>
    )
}

const StoreDetails = ({store})=>{
    return(
        <Box bg='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4'>
            <Flex justify={'space-between'}>
                <HStack>
                    <Text fontSize={'x-large'} fontWeight={'bold'} my='2'>MJ&Shelves</Text>
                    <Badge color={'#fff'} bg={'#4E2FD7'}>Active</Badge>
                </HStack>
                <HStack>
                    <Icon color='gray.600' boxSize='5' as={IoMdSettings}/>
                </HStack>
            </Flex>
            <Text my='2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
optio, eaque rerum! Provident similique accusantium nemo autem.</Text>
            {/**Contact */}
            <Box>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={MdEmail}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>mjsehlves@shelves.co.ke</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={FaPhone}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>+254 803 123 4567</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={FaLocationDot}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>Moi Avenue, Kenya.</Text>
                </HStack>
            </Box>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Staff:</Text>
                <Text>10</Text>
            </HStack>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Vendors:</Text>
                <Text>10</Text>
            </HStack>
            <HStack spacing='2' my='2' fontSize='md'>
                <Text fontWeight={'bold'}>Products:</Text>
                <Text>10</Text>
            </HStack>
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