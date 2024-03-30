import { Box, Button, Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import React from 'react';
import { IoMdAdd } from "react-icons/io";

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
                    {shops?.map((shop)=>{
                        return(
                            <StoreItem store={shop}/>
                        )
                    })}
                </Box>
            </GridItem>
            <GridItem bg='#fff' p='4' borderRadius={'5'}>
                <Text>Store Details</Text>
            </GridItem>
            <GridItem bg='papayawhip' />
        </Grid>
    </Box>
  )
}

export default Page;

const StoreItem = ({store}) =>{
    return(
        <HStack align='center' bg='#E4F0FC' borderRadius={'md'} mb='2' p='4' spacing='4'>
            <Box w='50px' h='50px' borderRadius={'md'} bg='#000000'/>
            <Text>{store.name}</Text>
        </HStack>
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