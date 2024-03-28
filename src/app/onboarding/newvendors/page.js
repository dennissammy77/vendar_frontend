'use client'
import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react';

function Page() {
    const router = useRouter()
  return (
    <Box>
        <Text>New Vendors</Text>
        <Button>
            Next
        </Button>
    </Box>
  )
}

export default Page;