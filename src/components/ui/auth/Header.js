import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const Header=({
    label
})=>{
  return (
    <Box w='full' display={'flex'} flexDirection={'column'} gap='2' alignItems={'center'} justify='center'>
        <Text fontSize='2xl' fontWeight={'bold'}>🔐Auth</Text>
        <Text fontSize='sm' fontWeight={'bold'} color='gray.400'>{label}</Text>
    </Box>
  )
}

export default Header