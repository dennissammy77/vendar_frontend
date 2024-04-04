'use client'
import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
    const router = useRouter();
    return (
        <Box>
            <Text>
                Staff
            </Text>
            <Button onClick={(()=>{router.push('/dashboard/staff/new')})}>New</Button>
        </Box>
    )
}