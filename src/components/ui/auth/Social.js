'use client';
import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'


export const Social=()=>{
    return(
        <Flex w='full' gap='2'>
            <Button variant={'outline'} w='full' size={'lg'}>
                <Icon as={FcGoogle} />
            </Button>
            <Button variant={'outline'} w='full' size={'lg'}>
                <Icon as={FaGithub} />
            </Button>
        </Flex>
    )
}