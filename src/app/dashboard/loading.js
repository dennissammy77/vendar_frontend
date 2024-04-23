import { Flex, Text } from "@chakra-ui/react";
import Script from "next/script";

export default function LOADING(){
    return (
        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
            <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>LOADING...</Text>
            <Script src="https://cdn.lordicon.com/lordicon.js"></Script>
            <lord-icon
                src="https://cdn.lordicon.com/qucadebu.json"
                trigger="loop"
                delay="1000"
                stroke="bold"
                colors="primary:#e4f0fc,secondary:#4e2fd7"
                style={{width:'150px',height:'150px'}}>
            </lord-icon>
            <a href="https://lordicon.com/" style={{fontSize:'6px'}}>Icons by Lordicon.com</a>
        </Flex>
    )
}