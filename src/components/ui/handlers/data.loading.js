import { Flex, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

function DATA_LOADING({message}) {
  return (
    <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
        <Spinner />
        <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>{message}</Text>
    </Flex>
  )
}

export default DATA_LOADING