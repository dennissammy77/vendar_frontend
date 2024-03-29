import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";
import LOGO from "../lib/LOGO";

export default function Layout({children}){
    return(
        <Flex h='100vh' w='100%' flexDirection={{sm:'',md:'column',lg:'row'}}>
            <Box h='100%' w={{sm:'100%',md:'100%',lg:'50%'}} bgGradient='linear(to-t,#eab122, #f1c23e, #f5cc5a, #f2c852)' display={{sm:'none',md:'none',lg:'flex'}} flexDirection={'column'} p='8'>
                <LOGO color='#4E2FD7' size='40px'/>
                <Image src='../auth_bg.jpg' w='full' h='full' alt='new_store_bg' objectFit={'cover'} flex={1}/>
            </Box>
            <Flex h='100%' align='center' justify='center' w={{sm:'100%',md:'100%',lg:'50%'}}>
                {children}
            </Flex>
        </Flex>
    )
}