'use client'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import NavigationBody from './components/navigation'
import { IoStorefrontOutline } from "react-icons/io5";

export default function Layout({children}){
    return(
        <Box>
            <NavigationBody navigation={navigation}>
            {children}
            </NavigationBody>
        </Box>
    )
};

const navigation = [
    {
        id:     '1',
        title:  'Home',
        route:  '/dashboard/home'
    },
    {
        id: '2',
        title:  'Stores',
        icon: IoStorefrontOutline,
        route:  '/dashboard/stores'
    },
    {
        id: '3',
        title:  'Products',
    },
    {
        id: '4',
        title:  'Staff',
    },
    {
        id: '5',
        title:  'Vendors',
    },
    {
        id: '6',
        title:  'Customers',
    },
    {
        id: '7',
        title:  'Finances',
    },
    {
        id: '8',
        title:  'Settings',
    },
    {
        id: '9',
        title:  'Help Center',
    },
]