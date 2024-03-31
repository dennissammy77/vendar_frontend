'use client'
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import LOGO from "../lib/LOGO";

export default function Layout({children}){
    return(
        <Flex h='100vh' w='100%' flexDirection={'row'} align={'center'} justify={'center'}>
            <Flex h='100%' w={{md:'100%',lg:'50%'}} bgGradient='linear(to-t,#acb5ec, #adb8ee, #bac4f5, #bac4f5)' hideBelow={'md'} flexDirection={'column'} p='8' >
                <LOGO color='#4E2FD7' size='40px'/>
                <Image src='../new_store_bg0.jpg' boxSize={'full'} alt='new_store_bg' objectFit={'cover'} />
            </Flex>
            {/**
             * 
             * 
            <Box h='100%' w={{md:'full',lg:'50%'}} bgGradient='linear(to-t,#acb5ec, #adb8ee, #bac4f5, #bac4f5)' hideBelow={'sm'} flexDirection={'column'} p='8'>
                <LOGO color='#4E2FD7' size='40px'/>
                <Image src='../new_store_bg0.jpg' boxSize={'lg'} alt='new_store_bg' objectFit={'cover'} flex={1}/>
            </Box>
             */}
            <Flex h='100%' align='center' justify='center' w={{md:'full',lg:'50%'}}>
                {children}
            </Flex>
        </Flex>
    )
}