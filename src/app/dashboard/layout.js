'use client'
import { Box, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import NavigationBody from './components/navigation'
import { IoPeopleOutline, IoStorefrontOutline } from "react-icons/io5";
import { UserContext } from '@/components/providers/user.context';
import { useRouter } from 'next/navigation';
import { MdOutlineAdminPanelSettings, MdOutlineManageAccounts } from 'react-icons/md';
import { GiShoppingBag } from "react-icons/gi";

export default function Layout({children}){
    const {user} = useContext(UserContext);
    const toast = useToast();
    const router = useRouter()
    useEffect(()=>{
        if(!user){
            toast({ title: 'Error!', description: `User is not defined`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            //router.push('/signin');
            return 
        }
    })
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
        icon: GiShoppingBag,
        title:  'Products',
        route: '/dashboard/products'
    },
    {
        id: '4',
        icon: MdOutlineAdminPanelSettings,
        title:  'Staff',
        route: '/dashboard/staff'
    },
    {
        id: '5',
        icon: IoPeopleOutline,
        title:  'Vendors',
        route: '/dashboard/vendors'
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
        icon: MdOutlineManageAccounts,
        title:  'Settings',
        route: '/dashboard/settings'
    },
    {
        id: '9',
        title:  'Help Center',
    },
]