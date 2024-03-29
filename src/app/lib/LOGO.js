'use client'
import { Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react';

function LOGO({color,size}) {
    const router = useRouter();
    return (
        <Text fontWeight='bold' fontSize={size} color={color} cursor='pointer' onClick={(()=>{router.push('/')})}>VENDAR</Text>
    )
}

export default LOGO;