'use client'
import { Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react';

function LOGO({color}) {
    const router = useRouter();
    return (
        <Text fontWeight='bold' fontSize='40px' color={color} cursor='pointer' onClick={(()=>{router.push('/')})}>VENDAR</Text>
    )
}

export default LOGO;