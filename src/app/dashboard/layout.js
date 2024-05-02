'use client'
import { Box, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, Suspense  } from 'react'
import NavigationBody from './components/navigation'
import { IoPeopleOutline, IoStorefrontOutline } from "react-icons/io5";
import { UserContext } from '@/components/providers/user.context';
import { useRouter } from 'next/navigation';
import { MdOutlineAdminPanelSettings, MdOutlineManageAccounts, MdSupportAgent } from 'react-icons/md';
import { GiShoppingBag } from "react-icons/gi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { CiGrid42 } from 'react-icons/ci';
import LOADING from './loading';
import { ACCOUNT_SETTINGS_ICON, HOME_ICON, PEOPLE_ICON, PICKUPS_ICON, PRODUCT_ICON, STAFF_ICON, STORE_ICON, SUPPORT_ICON, TRANSACTION_ICON } from '@/components/lib/constants/icons';

export default function Layout({children}){
    return(
        <Box>
            <NavigationBody navigation={navigation}>
                <Suspense fallback={<LOADING/>}>
                    {children}
                </Suspense>
            </NavigationBody>
        </Box>
    )
};

const navigation = [
    {
        id:     '1',
        title:  'Home',
        icon: HOME_ICON,
        route:  '/dashboard/home'
    },
    {
        id: '2',
        title:  'Stores',
        icon: STORE_ICON,
        route:  '/dashboard/stores'
    },
    {
        id: '3',
        icon: PRODUCT_ICON,
        title:  'Products',
        route: '/dashboard/products'
    },
    {
        id: '4',
        icon: PICKUPS_ICON,
        title:  'PickUps',
        route: '/dashboard/pickups'
    },
    {
        id: '5',
        icon: STAFF_ICON,
        title:  'Staff',
        route: '/dashboard/staff'
    },
    {
        id: '6',
        icon: PEOPLE_ICON,
        title:  'Vendors',
        route: '/dashboard/vendors'
    },
    {
        id: '7',
        icon: TRANSACTION_ICON,
        title:  'Transactions',
        route: '/dashboard/transactions'
    },
    {
        id: '8',
        icon: ACCOUNT_SETTINGS_ICON,
        title:  'Settings',
        route: '/dashboard/settings'
    },
    {
        id: '9',
        title:  'Support',
        icon: SUPPORT_ICON,
        route: '/dashboard/support'
    },
]