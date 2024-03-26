import { Box } from "@chakra-ui/react";
import React from "react";

export default function Layout({children}){
    return(
        <Box h='100vh' w='100%' display={'flex'} alignItems={'center'} justify={'center'}>
            {children}
        </Box>
    )
}