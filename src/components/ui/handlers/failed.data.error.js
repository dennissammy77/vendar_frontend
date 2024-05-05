import { LEFT_ARROW_ICON, RELOAD_ICON } from '@/components/lib/constants/icons'
import { BASE_BRAND, SECONDARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme'
import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function FAILED_DATA_REQUEST({message}) {
    const router = useRouter()
    return (
        <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
            <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>Error occured fetching data</Text>
            <Text fontSize={'large'} fontWeight={'bold'} color='gray.400' my='2'>{message}</Text>
            <HStack spacing='2' my='2'>
                <Button bg={SECONDARY_BRAND} variant='filled' borderRadius={'md'} color={BASE_BRAND} onClick={(()=>{router.back()})} leftIcon={<LEFT_ARROW_ICON />}>Go Back</Button>
                <Button 
                    bg={TERTIARY_BRAND} 
                    variant='filled' 
                    borderRadius={'md'} 
                    color={SECONDARY_BRAND} 
                    onClick={(()=>{
                        if(typeof(window) === undefined ){
                            router.refresh
                        }else{
                            window.location.reload()
                        }
                    })} 
                    rightIcon={<RELOAD_ICON />}
                >Reload</Button>
            </HStack>
        </Flex>
    )
}

export default FAILED_DATA_REQUEST;