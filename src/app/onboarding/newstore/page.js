'use client'
import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react';

function Page() {
    const router = useRouter()
  return (
    <Box w='100%' bg='red'>
        <Text>New Store</Text>
        <Button onClick={(()=>{router.push('/newvendors')})}>
            Next
        </Button>
    </Box>
  )
}

export default Page;