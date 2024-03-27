import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";

export default function Layout({children}){
    return(
        <Flex h='100vh' w='100%' flexDirection={{sm:'column',md:'row'}}>
            <Box h='100%' w={{sm:'100%',md:'50%'}} bg='#4E2FD7' display={{sm:'none',md:'block'}}/>
            <Box display='center' alignItems={'center'} justify={'center'} h='100%' w={{sm:'100%',md:'50%'}}>
                {children}
            </Box>
        </Flex>
    )
}